import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Feature } from "geojson";
import Placeholder from "@/components/Placeholder";
import Select from "@/components/Select";
import { Data, setSelectedFeature, useData } from "@/data";
import { getCssVariable } from "@/util/dom";
import { clamp } from "@/util/math";
import classes from "./Map.module.css";

/** svg dimensions */
const width = 770;
const height = 400;

const byOptions = ["Country", "Region"];
type By = (typeof byOptions)[number];

const Map = ({ id = "map" }) => {
  /** get global state */
  const byCountry = useData((state) => state.byCountry);
  const byRegion = useData((state) => state.byRegion);
  const selectedFeature = useData((state) => state.selectedFeature);

  /** local state */
  const [by, setBy] = useState<By>(byOptions[0]);
  const mapInstance = useRef<ReturnType<typeof map> | null>(null);

  /** create unique instance of d3 map */
  useEffect(() => {
    mapInstance.current = map();
  }, []);

  /** update d3 map instance when props change */
  useEffect(() => {
    mapInstance.current?.(
      id,
      by === "Country" ? byCountry : byRegion,
      selectedFeature,
    );
  }, [id, byCountry, byRegion, by, selectedFeature]);

  /** show status */
  if (!byCountry || !byRegion) return <Placeholder>Loading map</Placeholder>;

  return (
    <div className="sub-section">
      <Select
        label="Group by:"
        value={by}
        onChange={setBy}
        options={byOptions}
      />

      <svg
        viewBox={[0, 0, width, height].join(" ")}
        id={id}
        className={classes.svg}
      >
        <g className="map-container">
          <g className="outline"></g>
          <g className="graticules"></g>
          <g className="features"></g>
        </g>
      </svg>

      <div className={classes.legend}>
        <span>Less Samples</span>
        <span className={classes.gradient}></span>
        <span>More Samples</span>
      </div>
    </div>
  );
};

export default Map;

/** d3 code */
const map = () => {
  /** things that require one time setup per map instance */

  /** create projection */
  const projection = d3.geoNaturalEarth1();

  fitProjection(projection);

  /** get scale when projection fit to earth bbox */
  const baseScale = projection.scale();

  /** reset projection */
  const resetProjection = () => {
    projection.center([0, 0]);
    projection.rotate([0, 0]);
    projection.scale(baseScale);
  };
  resetProjection();

  /** path calculator for projection */
  const path = d3.geoPath().projection(projection);

  /** long/lat lines */
  const graticules = d3.geoGraticule().step([20, 20])();

  /** d3 svg selection */
  type SVG = d3.Selection<SVGSVGElement, unknown, HTMLElement, unknown>;

  /** d3 zoom event */
  type ZoomEvent = d3.D3ZoomEvent<SVGSVGElement, unknown>;

  /** keep track of old transform to calculate deltas */
  let oldTransform: d3.ZoomTransform | undefined;

  /** update map view pan and zoom */
  const updateMap = (svg: SVG, fullEvent?: ZoomEvent) => {
    const { sourceEvent: event, transform } = fullEvent || {};

    /** get current projection components */
    let [x, y] = projection.center();
    let scale = projection.scale();
    let [lambda, phi] = projection.rotate();

    /** update components based on event transform */
    if (event && transform && oldTransform) {
      /** calculate deltas */
      const dx = transform.x - oldTransform.x;
      const dy = transform.y - oldTransform.y;
      const dk = transform.k - oldTransform.k;

      /** zoom event */
      if (dk) {
        /** set new zoom */
        scale = transform.k;

        /** original coords of pointer */
        const oldPointer = getPointer(svg.node(), projection, event);

        /** apply zoom */
        projection.scale(scale);

        /**
         * iteratively pan map under pointer such that new pointer coords
         * approach original
         */
        for (let iterations = 0; iterations < 3; iterations++) {
          /** new coords of pointer */
          const newPointer = getPointer(svg.node(), projection, event);

          /** set new pan */
          lambda += newPointer.x - oldPointer.x;
          y += newPointer.y - oldPointer.y;

          /** apply pan */
          projection.rotate([lambda, phi]);
          projection.center([x, y]);
        }
      } else {
        /** pan event */

        /** set new pan */
        lambda += (baseScale / scale / 2) * dx;
        y += (baseScale / scale / 2) * dy;
      }
    }

    /** store old transform */
    if (transform) oldTransform = transform;

    /** limit pan */
    const yLimit = 0.89 * (90 - 90 * (baseScale / scale));
    y = clamp(y, -yLimit, yLimit);
    if (lambda < -180) lambda += 360;
    if (lambda > 180) lambda -= 360;

    /** apply pan */
    projection.rotate([lambda, phi]);
    projection.center([x, y]);

    /** update paths based on projection */
    svg
      .selectAll<Element, Feature>("." + classes.outline)
      .attr("d", () => path({ type: "Sphere" }));
    svg.selectAll<Element, Feature>("." + classes.graticule).attr("d", path);
    svg.selectAll<Element, Feature>("." + classes.feature).attr("d", path);
  };

  /** return func to run for updating map */
  return (
    id: string,
    data: Data["byCountry"] | Data["byRegion"],
    selectedFeature: Data["selectedFeature"],
  ) => {
    if (!data) return;

    /** get svg selection */
    const svg = d3.select<SVGSVGElement, unknown>("#" + id);

    if (!svg.node()) return;

    /** draw projection outline */
    svg
      .select(".outline")
      .selectAll("." + classes.outline)
      .data([graticules])
      .join("path")
      .attr("class", classes.outline)
      .attr("d", () => path({ type: "Sphere" }));

    /** draw graticules */
    svg
      .select(".graticules")
      .selectAll("." + classes.graticule)
      .data([graticules])
      .join("path")
      .attr("class", classes.graticule)
      .attr("d", path);

    /** get range of sample counts */
    const [, max = 1000] = d3.extent(
      data.features,
      (d) => d.properties.samples,
    );

    /** get css variable colors */
    const primary = getCssVariable("--primary");
    const gray = getCssVariable("--gray");
    const secondary = getCssVariable("--secondary");
    const darkGray = getCssVariable("--dark-gray");

    /** color scale */
    const scale = d3
      .scaleLog<string>()
      .domain([1, max])
      .range([gray, primary])
      .interpolate(d3.interpolateLab);

    /** draw features */
    svg
      .select(".features")
      .selectAll("." + classes.feature)
      .data(data.features)
      .join("path")
      .attr("class", classes.feature)
      .attr("d", path)
      .attr("fill", (d) =>
        !selectedFeature
          ? scale(d.properties.samples || 1)
          : (
              selectedFeature.country
                ? selectedFeature.country === d.properties.country
                : selectedFeature.region === d.properties.region
            )
          ? secondary
          : darkGray,
      )
      .attr("role", "graphics-symbol")
      .attr(
        "data-tooltip",
        ({ properties: { region, country, code, samples } }) =>
          [
            `<div class="tooltip-table">`,
            region && `<span>Region</span><span>${region || "???"}</span>`,
            (country || code) &&
              `<span>Country</span><span>${country || "???"} (${
                code || "??"
              })</span>`,
            `<span>Samples</span><span>${samples.toLocaleString()}</span>`,
            `</div>`,
          ]
            .filter(Boolean)
            .join(""),
      )
      .on("keydown", selectFeature)
      .on("click", selectFeature);

    /** zoom handler */
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([baseScale, baseScale * 10])
      .on("zoom", (event) => updateMap(svg, event));

    /** connect zoom handler to svg */
    svg
      .call((event) => zoom(svg, event))
      /** always prevent scroll on wheel, not just when at scale limit */
      .on("wheel", (event) => event.preventDefault());

    /** double click handler */
    svg.on("dblclick.zoom", () => {
      zoom.transform(svg, d3.zoomIdentity);
      resetProjection();
      updateMap(svg);
    });
  };
};

/** fit projection to bbox of earth */
const fitProjection = (projection: d3.GeoProjection) =>
  projection.fitSize([width, height], {
    type: "Feature",
    properties: {},
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [-180, -90],
          [180, -90],
          [180, 90],
          [-180, 90],
        ],
      ],
    },
  });

/** get pointer position in projection coordinates */
const getPointer = (
  svg: SVGSVGElement | null,
  projection: d3.GeoProjection,
  event: PointerEvent | WheelEvent | TouchEvent,
) => {
  /** point in screen coords */
  const screenPoint = new DOMPoint(0, 0);

  /** mouse */
  if ("clientX" in event) {
    screenPoint.x = event.clientX;
    screenPoint.y = event.clientY;
  }

  /** touch(es) */
  if ("touches" in event) {
    if (event.touches.length === 1) {
      screenPoint.x = event.touches[0].clientX;
      screenPoint.y = event.touches[0].clientY;
    }
    if (event.touches.length === 2) {
      screenPoint.x = (event.touches[0].clientX + event.touches[1].clientX) / 2;
      screenPoint.y = (event.touches[0].clientY + event.touches[1].clientY) / 2;
    }
  }

  /** point in svg coords */
  const svgPoint = screenPoint.matrixTransform(svg?.getScreenCTM()?.inverse());

  /** point in map coords */
  const mapPoint = projection.invert?.([svgPoint.x, svgPoint.y]) || [];

  return { x: mapPoint[0] || 0, y: -(mapPoint[1] || 0) };
};

/** select country or region on pointer or key click */
const selectFeature = (
  event: PointerEvent | KeyboardEvent,
  d: NonNullable<Data["byCountry"] | Data["byRegion"]>["features"][number],
) => {
  const feature = d.properties;
  /** key press */
  if ("key" in event) {
    if (event.key === "Enter") setSelectedFeature(feature);
    if (event.key === "Escape") setSelectedFeature(undefined);
  } else {
    /** pointer click */
    setSelectedFeature(feature);
    event.stopPropagation();
  }
};

/** unset selected feature when clicking off map */
d3.select(window).on("click", () => setSelectedFeature());
