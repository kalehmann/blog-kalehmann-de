// @license magnet:?xt=urn:btih:1f739d935676111cfff4b4693e3816e664797050&dn=gpl-3.0.txt GPL-3.0
const data = {
    svg_scale: 1,
    reflector_position: 0,
    reflector_diameter: 2,
    reflector_length: 0,
    driven_element_position: 0,
    driven_element_diameter: 2,
    driven_element_offset: 0,
    director_1_position: 0,
    director_1_diameter: 2,
    director_1_offset: 0,
    director_2_position: 0,
    director_2_diameter: 2,
    director_2_offset: 0,
};

class NEC {
    constructor () {
	this.comments = ["CM ", "CE "]
	this.geometry = []
	this.commands = []

	this.addCommand("EX", 0, 2, 11, 0, 1);
	this.addCommand("RP", 0, 19, 37, 1000, 0, 0, 10, 10);
	this.addCommand("NH");
	this.addCommand("NE");
	this.addCommand("ZO", 50);
	this.addCommand("FR", 0, 201, 0, 0, 144, 0.01, 146);
	this.addCommand("EN");
    }

    addGeometry (type, i1, i2, f1, f2, f3, f4, f5, f6, f7) {
	i1 = String(i1).padStart(5, " ");
	i2 = String(i2).padStart(5, " ");
	f1 = formatNumber(f1);
	f2 = formatNumber(f2);
	f3 = formatNumber(f3);
	f4 = formatNumber(f4);
	f5 = formatNumber(f5);
	f6 = formatNumber(f6);
	f7 = formatNumber(f7);

	this.geometry.push(
	    `${type} ${i1} ${i2} ${f1} ${f2} ${f3} ${f4} ${f5} ${f6} ${f7}`
	);

    }

    addCommand (type, i1 = 0, i2 = 0, i3 = 0, i4 = 0, f1 = 0, f2 = 0, f3 = 0, f4 = 0, f5 = 0, f6 = 0) {
	i1 = String(i1).padStart(5, " ");
	i2 = String(i2).padStart(5, " ");
	i3 = String(i3).padStart(5, " ");
	i4 = String(i4).padStart(5, " ");
	f1 = formatNumber(f1);
	f2 = formatNumber(f2);
	f3 = formatNumber(f3);
	f4 = formatNumber(f4);
	f5 = formatNumber(f5);
	f6 = formatNumber(f6);

	this.commands.push(
	    `${type} ${i1} ${i2} ${i3} ${i4} ${f1} ${f2} ${f3} ${f4} ${f5} ${f6}`
	)
    }

    addWire (tag, x1, y1, z1, x2, y2, z2, diameter) {
	this.addGeometry("GW", tag, 21, x1, y1, z1, x2, y2, z2, diameter / 2);
    }

    toString () {
	const intNull = String(0).padStart(5, " ");
	const floatNull = formatNumber(0);
	const geometryEnd = `GE ${intNull} ${intNull} ${floatNull} ${floatNull} ${floatNull} ${floatNull} ${floatNull} ${floatNull} ${floatNull}`;

	return this.comments.join("\n") + "\n" + this.geometry.join("\n") + "\n" + geometryEnd + "\n" + this.commands.join("\n") + "\n";
    }
}

const reposition = (rect, label, offset, length, diameter) => {
    const rectX = offset - diameter / 2;
    const rectY = -1 * length / 2;

    rect.setAttribute("height", length)
    rect.setAttribute("width", diameter)
    rect.setAttribute("x", rectX);
    rect.setAttribute("y", rectY);

    labelBox = label.getBoundingClientRect();
    label.setAttribute("x", rectX + (diameter - labelBox.width * data.svg_scale) / 2)
    label.setAttribute("y", rectY - labelBox.height * data.svg_scale / 2)
};

const formatNumber = (number) => {
    const exp = number === 0 ? 0 : Math.floor(Math.log10(Math.abs(number)));
    const coefficient = number / Math.pow(10, exp);
    const sign = exp < 0 ? "-" : "+";

    return `${coefficient.toFixed(5)}E${sign}${String(Math.abs(exp)).padStart(2, "0")}`;
};

const generateNec = (withBoom = true) => {
    const nec = new NEC();
    nec.addWire(
	1,
	-1 * data.reflector_length / 200,
	0,
	data.reflector_position / 100,
	data.reflector_length / 200,
	0,
	data.reflector_position / 100,
	data.reflector_diameter / 100,
    );

    nec.addWire(
	2,
	-1 * data.driven_element_length / 200,
	0,
	(data.reflector_position + data.driven_element_offset) / 100,
	data.driven_element_length / 200,
	0,
	(data.reflector_position + data.driven_element_offset) / 100,
	data.driven_element_diameter / 100,
    );

    nec.addWire(
	3,
	-1 * data.director_1_length / 200,
	0,
	(data.reflector_position + data.director_1_offset) / 100,
	data.director_1_length / 200,
	0,
	(data.reflector_position + data.director_1_offset) / 100,
	data.director_1_diameter / 100,
    );

    nec.addWire(
	4,
	-1 * data.director_2_length / 200,
	0,
	(data.reflector_position + data.director_2_offset) / 100,
	data.director_2_length / 200,
	0,
	(data.reflector_position + data.director_2_offset) / 100,
	data.director_2_diameter / 100,
    );

    return nec.toString();
};

const download = (filename, content) => {
    const el = document.createElement('a');
    el.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    el.setAttribute('download', filename);
    el.style.display = 'none';
    document.body.appendChild(el);
    el.click();
    document.body.removeChild(el);
}

const recalculate = () => {
    const yagiSvg = document.querySelector("#yagi_svg");
    const reflectorRect = yagiSvg.querySelector("#reflector");
    const reflectorLabel = yagiSvg.querySelector("#label_reflector");
    const drivenElementRect = yagiSvg.querySelector("#driven_element");
    const drivenElementLabel = yagiSvg.querySelector("#label_driven_element");
    const director1Rect = yagiSvg.querySelector("#director_1");
    const director1Label = yagiSvg.querySelector("#label_director_1");
    const director2Rect = yagiSvg.querySelector("#director_2");
    const director2Label = yagiSvg.querySelector("#label_director_2");
    const viewBoxWidth = Math.max(data.driven_element_offset, data.director_1_offset, data.director_2_offset) + 20;
    const viewBoxHeight = Math.max(data.driven_element_length, data.director_1_length, data.director_2_length) + 20;

    yagiSvg.setAttribute("viewBox", `0 ${-viewBoxHeight / 2} ${viewBoxWidth} ${viewBoxHeight}`);
    data.svg_scale = viewBoxWidth / yagiSvg.getBoundingClientRect().width;

    reposition(reflectorRect, reflectorLabel, data.reflector_position + 10, data.reflector_length, data.reflector_diameter);
    reposition(
	drivenElementRect,
	drivenElementLabel,
	data.driven_element_offset + data.reflector_position + 10,
	data.driven_element_length,
	data.driven_element_diameter,
    );
    reposition(
	director1Rect,
	director1Label,
	data.director_1_offset  + data.reflector_position + 10,
	data.director_1_length,
	data.director_1_diameter,
    );
    reposition(
	director2Rect,
	director2Label,
	data.director_2_offset  + data.reflector_position + 10,
	data.director_2_length,
	data.director_2_diameter,
    );
};

const watch = (id) => {
    const form = document.querySelector("#four_element_yagi_form");
    const inputElement = form.querySelector(`#${id}`);

    data[id] = parseFloat(inputElement.value);
    inputElement.addEventListener("input", (event) => {
	data[id] = parseFloat(event.target.value);
	recalculate();
    });

    form.addEventListener("reset", (event) => {
	data[id] = parseFloat(inputElement.defaultValue);
	recalculate();
    });
};

(() => {
    watch("reflector_length");
    watch("driven_element_offset");
    watch("driven_element_length");
    watch("director_1_offset");
    watch("director_1_length");
    watch("director_2_offset");
    watch("director_2_length");

    const downloadButton = document.querySelector("#four_element_yagi_form #download_button");
    downloadButton.addEventListener("click", (event) => {
	download("yagi.nec", generateNec());
    });

    recalculate();
})();
// @license-end
