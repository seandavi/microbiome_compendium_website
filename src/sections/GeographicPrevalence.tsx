import { useEffect, useState } from "react";
import * as d3 from "d3";
import { Feature } from "geojson";
import Placeholder from "@/components/Placeholder";
import Select from "@/components/Select";
import { Data } from "@/data";
import { getCssVariable } from "@/util/dom";
import { clamp } from "@/util/math";

type Props = {
  id: string;
  title: string;
  byCountry: Data["byCountry"];
  byRegion: Data["byRegion"];
};

/** svg dimensions */
const width = 800;
const height = 400;

const byOptions = ["Country", "Region"];
type By = (typeof byOptions)[number];

const GeographicPrevalence = ({ id, title, byCountry, byRegion }: Props) => {
  const [by, setBy] = useState<By>(byOptions[0]);

  /** rerun d3 code when props change */
  useEffect(() => {
    chart(id, by === "Country" ? byCountry : byRegion);
  }, [id, byCountry, byRegion, by]);

  /** show status */
  if (!byCountry || !byRegion)
    return <Placeholder>Loading "{title}" table</Placeholder>;

  return (
    <>
      <svg viewBox={[0, -10, width, height + 20].join(" ")} id={id}>
        <g className="map-container" clipPath="url(#map-clip)">
          <g className="graticules"></g>
          <g className="countries"></g>
        </g>
        <clipPath id="map-clip">
          <rect x="0" y="0" width={width} height={height} />
        </clipPath>
      </svg>
      <Select
        label="Group by:"
        value={by}
        onChange={setBy}
        options={byOptions}
      />
    </>
  );
};

export default GeographicPrevalence;

/** d3 code */

const graticules = d3.geoGraticule().step([20, 20])();

const chart = (id: string, data: Props["byCountry"] | Props["byRegion"]) => {
  if (!data) return;

  const svg = d3.select<SVGSVGElement, unknown>("#" + id);

  /** create projection */
  const projection = d3.geoNaturalEarth1();

  /** fit projection */
  const fit = () => {
    projection.center([0, 0]);
    projection.fitSize([width, height], data);
    projection.rotate([0, 0]);
  };
  fit();

  /** get scale when projection fit to contents */
  const baseScale = projection.scale();

  /** path calculator for projection */
  const path = d3.geoPath().projection(projection);

  /** draw graticules */
  svg
    .select(".graticules")
    .selectAll(".graticule")
    .data([graticules])
    .join("path")
    .attr("class", "graticule")
    .attr("d", path);

  /** get range of sample counts */
  const [, max = 1000] = d3.extent(data.features, (d) => d.properties.samples);

  /** get css variable colors */
  const primary = getCssVariable("--primary");
  const gray = getCssVariable("--gray");

  /** color scale */
  const scale = d3
    .scaleLog<string>()
    .domain([1, max])
    .range([gray, primary])
    .interpolate(d3.interpolateLab);

  /** draw features (countries) */
  svg
    .select(".countries")
    .selectAll(".country")
    .data(data.features)
    .join("path")
    .attr("class", "country")
    .attr("d", path)
    .attr("fill", (d) => scale(d.properties.samples || 1))
    .attr("data-tooltip", ({ properties: { code, name, samples, region } }) =>
      [
        `<div class="tooltip-table">`,
        region && `<span>Region</span><span>${region || "???"}</span>`,
        (name || code) &&
          `<span>Country</span><span>${name || "???"} (${code || "??"})</span>`,
        `<span>Samples</span><span>${samples.toLocaleString()}</span>`,
        `</div>`,
      ]
        .filter(Boolean)
        .join("")
    );

  const update = () => {
    /** get current projection components */
    let [x, y] = projection.center();
    const scale = projection.scale();

    /** limit projection */
    const angleLimit = 90 - 90 * (baseScale / scale);
    y = clamp(y, -angleLimit, angleLimit);
    projection.center([x, y]);

    /** update paths based on projection */
    svg.selectAll<Element, Feature>(".graticule").attr("d", path);
    svg.selectAll<Element, Feature>(".country").attr("d", path);
  };

  /** mouse drag handler */
  const drag = d3
    .drag<SVGSVGElement, unknown, unknown>()
    .on("drag", (event) => {
      /** get current projection components */
      let [x, y] = projection.center();
      const scale = projection.scale();
      let [lambda, phi] = projection.rotate();

      /** update components based on drag */
      lambda += (baseScale / 2) * (event.dx / scale);
      y += (baseScale / 2) * (event.dy / scale);

      /** update projection */
      projection.rotate([lambda, phi]);
      projection.center([x, y]);

      update();
    });
  svg.call(drag);

  /** zoom handler */
  const zoom = d3
    .zoom<SVGSVGElement, unknown>()
    .scaleExtent([baseScale, baseScale * 10])
    .on("zoom", (event) => {
      projection.scale(event.transform.k);
      update();
    });
  svg.call(zoom).on("wheel", (event) => event.preventDefault());

  /** double click handler */
  svg.on("dblclick.zoom", () => {
    zoom.transform(svg, d3.zoomIdentity);
    fit();
    update();
  });
};
