// @license magnet:?xt=urn:btih:1f739d935676111cfff4b4693e3816e664797050&dn=gpl-3.0.txt GPL-3.0

const data = {
    bending_radius: 0,
    conductor_diameter: 0,
    frequency: 0,
    height: 0,
    large_diameter: 0,
    large_height: 0,
    large_helix_length: 0,
    large_loop: 0,
    large_loop_adjusted: 0,
    loop: 0,
    small_diameter: 0,
    small_height: 0,
    small_helix_length: 0,
    small_loop: 0,
    small_loop_adjusted: 0,
    source: "coppens",
    width_to_height_ratio: 0,
};

const correct_loop_bending = (length) => {
    const round_edge = Math.PI * data.bending_radius * 0.5;
    const straight_edge = 2 * data.bending_radius
    
    return length + 4 * (straight_edge - round_edge);
};

const deviate = (wavelength) => {
    switch (data.source) {
    case "coppens":
 	switch (data.conductor_diameter) {
	case 4:
	    return wavelength * (1 - 0.017);
	case 8:
	    return wavelength * (1 - 0.026);
	case 12:
	default:
	    return wavelength * (1 - 0.036);
	case 15:
	    return wavelength * (1 - 0.049);
	}
    case "hollander":
    default:
 	switch (data.conductor_diameter) {
	case 4:
	    return wavelength * (1 - 0.013);
	case 8:
	    return wavelength * (1 - 0.028);
	case 12:
	default:
	    return wavelength * (1 - 0.025);
	case 15:
	    return wavelength * (1 - 0.033);
	}
    }
};

const elongate = (wavelength) => {
    switch (data.source) {
    case "coppens":
 	switch (data.conductor_diameter) {
	case 4:
	    return wavelength * (1 + 0.068);
	case 8:
	    return wavelength * (1 + 0.071);
	case 12:
	default:
	    return wavelength * (1 + 0.07);
	case 15:
	    return wavelength * (1 + 0.068);
	}
    case "hollander":
    default:
 	switch (data.conductor_diameter) {
	case 4:
	    return wavelength * (1 + 0.046);
	case 8:
	    return wavelength * (1 + 0.067);
	case 12:
	default:
	    return wavelength * (1 + 0.072);
	case 15:
	    return wavelength * (1 + 0.07);
	}
    }
};

const fill = (id, value) => {
    document.querySelector(`#${id}`).innerHTML = value;
};


const recalculate = () => {
    data.loop = 300000 / data.frequency;
    data.large_loop = elongate(data.loop);
    data.small_loop = deviate(data.loop);

    data.large_loop_adjusted = correct_loop_bending(data.large_loop);
    data.small_loop_adjusted = correct_loop_bending(data.small_loop);
    
    const alpha = Math.atan(data.width_to_height_ratio * Math.PI * 0.5);
    const t = Math.cos(alpha) * data.width_to_height_ratio;

    data.large_helix_length = data.large_loop_adjusted / (2 + 2 * t);
    data.small_helix_length = data.small_loop_adjusted / (2 + 2 * t);

    data.large_diameter = data.large_loop_adjusted / 2 - data.large_helix_length;
    data.small_diameter = data.small_loop_adjusted / 2 - data.small_helix_length;

    data.large_height = data.large_diameter / data.width_to_height_ratio;
    data.small_height = data.small_diameter / data.width_to_height_ratio;

    refill();
};

const refill = () => {
    fill("freq", data.frequency.toFixed(1));
    fill("wavelength", Math.round(data.loop));
    fill("large_length", Math.round(data.large_loop));
    fill("small_length", Math.round(data.small_loop));
    fill("large_length_adjusted", Math.round(data.large_loop_adjusted))
    fill("small_length_adjusted", Math.round(data.small_loop_adjusted));
    fill("large_diameter_wo_bending", Math.round(data.large_diameter));
    fill("small_diameter_wo_bending", Math.round(data.small_diameter));
    fill(
	"large_diameter_with_bending",
	Math.round(data.large_diameter - 2 * data.bending_radius),
    );
    fill(
	"small_diameter_with_bending",
	Math.round(data.small_diameter - 2 * data.bending_radius),
    );
    fill("large_height", Math.round(data.large_height));
    fill("small_height", Math.round(data.small_height));
    fill(
	"small_helix_with_bending",
	Math.round(data.small_helix_length - 2 * data.bending_radius),
    );
    fill(
	"large_helix_with_bending",
	Math.round(data.large_helix_length - 2 * data.bending_radius),
    );
    fill("small_helix_wo_bending", Math.round(data.small_helix_length));
    fill("large_helix_wo_bending", Math.round(data.large_helix_length));
};

const setupForm = () => {
    const form = document.querySelector("#qfh_form");
    form.style.display = "block";

    watch("bending_radius");
    watch("conductor_diameter");
    watch("frequency");
    watch("source", false);
    watch("width_to_height_ratio");

    recalculate();
};

const watch = (id, isNumber = true) => {
    const form = document.querySelector("#qfh_form");
    const inputElement = form.querySelector(`#${id}`);
    const value = inputElement.value;

    data[id] = isNumber ? parseFloat(value) : value;
    inputElement.addEventListener("input", (event) => {
	const value = event.target.value;
	data[id] = isNumber ? parseFloat(value) : value;
	recalculate();
    });
};

(() => {
    setupForm();
})();
// @license-end
