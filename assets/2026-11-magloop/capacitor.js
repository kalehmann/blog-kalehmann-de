// @license magnet:?xt=urn:btih:1f739d935676111cfff4b4693e3816e664797050&dn=gpl-3.0.txt GPL-3.0

"use strict";

const data = {
    rotor_plates: 2,
    area: 20.0,
    distance: 3.0,
};
const svg_additional_elements = new Set();

const recalculate = () => {
    const area_m2 = data.area / 10000;
    const dist_m = data.distance / 1000;
    const plate_area = area_m2 * data.rotor_plates
    const c1 = 8.854e-12 * plate_area / dist_m;
    const cPf = 1/(2/c1) * 1e12;
    const c1Pf = c1 * 1e12;

    document.querySelector("#capacitance_c1_1").innerHTML = c1Pf.toFixed(2);
    document.querySelector("#capacitance_c1_2").innerHTML = c1Pf.toFixed(2);
    document.querySelector("#capacitance_c2_1").innerHTML = c1Pf.toFixed(2);
    document.querySelector("#capacitance_c2_2").innerHTML = c1Pf.toFixed(2);
    document.querySelector("#n_active_gaps").innerHTML = data.rotor_plates;
    document.querySelector("#n_stator_plates").innerHTML = (data.rotor_plates + 2) / 2;
    document.querySelector("#plate_area").innerHTML = area_m2.toFixed(4);
    document.querySelector("#plate_gaps").innerHTML = data.rotor_plates;
    document.querySelector("#plate_distance").innerHTML = dist_m.toFixed(4);
    document.querySelector("#series_capacitance").innerHTML = c1Pf.toFixed(2);
    document.querySelector("#total_capacitance").innerHTML = cPf.toFixed(2);

    renderCapacitor();
};

const renderCapacitor = () => {
    const svgContainer = document.querySelector("#capacitor_svg_container");
    const svg = svgContainer.getElementsByTagName("svg")[0];
    svgContainer.style.display = "block";
    svg.style.maxHeight = "20vw";

    const minX = -1 * ((data.rotor_plates / 2) * 20 + 10) - 5;
    const minY = -32;
    const height = minY * -2;
    const width = minX * -2;

    svg.setAttribute("viewBox", `${minX} ${minY} ${width} ${height}`);

    svg_additional_elements.forEach((el) => {
        el.parentNode.removeChild(el);
    });
    svg_additional_elements.clear();
    const right_side = svg.querySelector("#right_side");
    const axis = right_side.querySelector("#axis");
    // axis.setAttribute("transform", `scale(${data.rotor_plates / 2}, 1)`);
    const rotor = right_side.querySelector("#rotor");
    const stator = right_side.querySelector("#stator");
    for (let i = 2; i < Math.max(1, data.rotor_plates / 2) + 1; i++) {
        const a = axis.cloneNode(true);
        const r = rotor.cloneNode(true);
        const s = stator.cloneNode(true);

        a.setAttribute("transform", `translate(${20 * (i - 1)}, 0)`);
        r.setAttribute("transform", `translate(${20 * (i - 1)}, 0)`);
        s.setAttribute("transform", `translate(${20 * (i - 1)}, 0)`);

        right_side.appendChild(a);
        right_side.appendChild(r);
        right_side.appendChild(s);

        svg_additional_elements.add(a);
        svg_additional_elements.add(r);
        svg_additional_elements.add(s);
    }

    const left_side = right_side.cloneNode(true);
    svg.appendChild(left_side);
    left_side.setAttribute("transform", "rotate(-180)");
    svg_additional_elements.add(left_side);
    left_side.querySelectorAll('[fill="#00009d"]').forEach((el) => {
        el.setAttribute("fill", "#009d00");
    });
};

const setupForm = () => {
    const form = document.querySelector("#capacitor_form");
    form.querySelectorAll("input").forEach((el) => {
        el.disabled = false;
    });

    watch("area", parseFloat);
    watch("distance", parseFloat);
    watch("rotor_plates", toEven);

    recalculate();
};

const toEven = (val) => {
    const i = Math.round(parseFloat(val));

    if (i % 2) {
        return i + 1;
    }

    return i;
};

const watch = (id, mapper) => {
    const form = document.querySelector("#capacitor_form");
    const inputElement = form.querySelector(`#${id}`);
    const min = inputElement.hasAttribute("min")
	  ? parseFloat(inputElement.getAttribute("min"))
	  : 0;
    const value = inputElement.value;

    data[id] = mapper(value);
    inputElement.addEventListener("input", (event) => {
        const value = event.target.value;
	const v = isNaN(mapper(value)) ? min : mapper(value);
        data[id] = v < min ? min : v;
        recalculate();
    });

};

(() => {
    setupForm();
})();

// @license-end
