(function () {
    var canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var gl = canvas.getContext("experimental-webgl") || canvas.getContext("webgl");
    var ext = gl.getExtension("ANGLE_instanced_arrays");

    gl.clearColor(0, 0, 0, 1);

    var vertexShaderSrc = [
        "attribute vec2 position;",
        "attribute vec2 offset;",
        "void main() {",
        "gl_Position = vec4(offset + position, 0., 1.);",
        "}"].join("\n");

    var fragmentShaderSrc = [
        "precision highp float;",
        "void main() {",
        "gl_FragColor = vec4(1.);",
        "}"].join("\n");

    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSrc);
    gl.compileShader(vertexShader);

    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(vertexShader));
    }

    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSrc);
    gl.compileShader(fragmentShader);

    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(fragmentShader));
    }

    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(program));
    }

    var positionLocation = gl.getAttribLocation(program, "position");
    var offsetLocation = gl.getAttribLocation(program, "offset");

    var numInstances = 4;

    var positions = new Float32Array([
        -0.25, -0.25,
        0.25, -0.25,
        0, 0.25
    ]);

    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    var offsets = new Float32Array(numInstances * 2);
    offsets.set([
        0.5, 0.5,
        0.5, -0.5,
        -0.5, -0.5,
        -0.5, 0.5,
    ]);
    var offsetBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, offsetBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, offsets, gl.STATIC_DRAW);

    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    ext.vertexAttribDivisorANGLE(offsetLocation, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, offsetBuffer);
    gl.vertexAttribPointer(offsetLocation, 2, gl.FLOAT, false, 0, 0);
    ext.vertexAttribDivisorANGLE(offsetLocation, 1);

    gl.enableVertexAttribArray(positionLocation);
    gl.enableVertexAttribArray(offsetLocation);

    ext.drawArraysInstancedANGLE(gl.TRIANGLES, 0, 3, 4);

    gl.disableVertexAttribArray(offsetLocation);
    gl.disableVertexAttribArray(positionLocation);

})();
