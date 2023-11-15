<script>
	export let rpm = 100;
	export let speed = 50;
	export let gear = 3;
	export let mode = 0;
	export let lightState = 0;

	//Turn 0 into O for Font Reasons
	$: speedDisplayText = formatSpeed(speed.toFixed(0));

	//Rotation of Needle range 0-242
	$: rot = Math.min(rpm * 242, 242);

	//Testing
	// function randRot() {
	//     rot = (rot + 1) % 243;
	//     speed = Math.floor(Math.random() * 1000);
	// }

	//Replace Char for Font
	function formatSpeed(speed) {
		let text = String(speed);
		return text.replace('0', 'O');
	}
	//Filter for copy and paste
	//<filter id="blur" x="-50%" width="200%" y="-50%" height="200%">
	//  <feGaussianBlur stdDeviation="50" />
	//</filter>
</script>

<!-- Testing
<svelte:window on:keypress={randRot} /> -->

<svg
	xmlns="http://www.w3.org/2000/svg"
	xmlns:xlink="http://www.w3.org/1999/xlink"
	viewBox="0 0 1000 1000"
	class="cssistcomplex">
	<defs>
		<style>
			.cls-1 {
				font-size: 62.88px;
			}
			.cls-1,
			.cls-10,
			.cls-12,
			.cls-13,
			.cls-14,
			.cls-17,
			.cls-2,
			.cls-4,
			.cls-5,
			.cls-7 {
				fill: #a2cce2;
			}
			.cls-1,
			.cls-12 {
				font-family: Arial-BoldMT, Arial;
			}
			.cls-1,
			.cls-12,
			.cls-13,
			.cls-14,
			.cls-17,
			.cls-18,
			.cls-19,
			.cls-22,
			.cls-4,
			.cls-5,
			.cls-7,
			.cls-8 {
				font-weight: 700;
			}
			.cls-11,
			.cls-18,
			.cls-19,
			.cls-24,
			.cls-25,
			.cls-3,
			.cls-8 {
				fill: #ed1c24;
			}
			.cls-4 {
				font-size: 71.4px;
			}
			.cls-13,
			.cls-14,
			.cls-17,
			.cls-18,
			.cls-19,
			.cls-4,
			.cls-5,
			.cls-7,
			.cls-8 {
				font-family: MicroExtendFLF-Bold, MicroExtendFLF;
			}
			.cls-5 {
				font-size: 53.56px;
			}
			.cls-6 {
				letter-spacing: -0.18em;
			}
			.cls-7,
			.cls-8 {
				font-size: 119.68px;
			}
			.cls-9 {
				letter-spacing: -0.18em;
			}
			.cls-10,
			.cls-11,
			.cls-13,
			.cls-14,
			.cls-17,
			.cls-18,
			.cls-19,
			.cls-25 {
				stroke: #231f20;
				stroke-miterlimit: 10;
				stroke-width: 0.5px;
			}
			.cls-12 {
				font-size: 41.92px;
			}
			.cls-13 {
				font-size: 40.57px;
			}
			.cls-14 {
				font-size: 30.43px;
			}
			.cls-15 {
				letter-spacing: -0.18em;
			}
			.cls-16 {
				letter-spacing: 0em;
			}
			.cls-17,
			.cls-18,
			.cls-19 {
				font-size: 68px;
			}
			.cls-19 {
				letter-spacing: -0.18em;
			}
			.cls-20 {
				letter-spacing: 0em;
			}
			.cls-21 {
				opacity: 0.75;
				fill: url(#linear-gradient);
			}
			.cls-22 {
				font-size: 116.42px;
				fill: #231f20;
				font-family: DSEG14Classic-Bold, DSEG14Classic;
				text-align: right;
			}
			.cls-23 {
				opacity: 0.2;
			}
			.cls-24,
			.cls-25 {
				font-size: 116.42px;
				font-family: DSEG14Classic-Regular, DSEG14Classic;
			}
		</style>
		<linearGradient
			id="linear-gradient"
			x1="314.93"
			y1="813.2"
			x2="691.04"
			y2="813.2"
			gradientUnits="userSpaceOnUse">
			<stop offset="0" stop-color="#495e80" />
			<stop offset="0" stop-color="#475c7f" />
			<stop offset="0.06" stop-color="#374b77" />
			<stop offset="0.13" stop-color="#2c4071" />
			<stop offset="0.23" stop-color="#26396e" />
			<stop offset="0.5" stop-color="#24376d" />
			<stop offset="0.77" stop-color="#26396e" />
			<stop offset="0.87" stop-color="#2c4071" />
			<stop offset="0.94" stop-color="#374b76" />
			<stop offset="0.99" stop-color="#465c7e" />
			<stop offset="1" stop-color="#495f7f" />
		</linearGradient>
		<filter id="blur" x="-50%" width="200%" y="-50%" height="200%">
			<feGaussianBlur stdDeviation="50" />
		</filter>
	</defs>
	{#if lightState}
		<image x="0" y="0" width="1000" height="1000" href="img/NFSSpeedoBlur.png" />
	{/if}
	<g id="Big_Bars" data-name="Big Bars">
		<rect class="cls-10" x="489.99" y="59.81" width="20" height="70" />
		<rect
			class="cls-11"
			x="838.83"
			y="670.2"
			width="20"
			height="70"
			transform="translate(1888.03 333.87) rotate(120.62)" />
		<rect
			class="cls-10"
			x="141.39"
			y="671.05"
			width="20"
			height="70"
			transform="translate(-381.29 1193.58) rotate(-120.36)" />
		<rect
			class="cls-10"
			x="88.69"
			y="506.77"
			width="20"
			height="70"
			transform="translate(-431.1 692.06) rotate(-95.51)" />
		<rect
			class="cls-10"
			x="106.24"
			y="334.6"
			width="20"
			height="70"
			transform="translate(-271.08 359.91) rotate(-71.11)" />
		<rect
			class="cls-10"
			x="193.38"
			y="189.51"
			width="20"
			height="70"
			transform="translate(-99.48 218.01) rotate(-46.6)" />
		<rect
			class="cls-10"
			x="331.9"
			y="92.27"
			width="20"
			height="70"
			transform="translate(-22.56 143.44) rotate(-22.96)" />
		<rect
			class="cls-10"
			x="651"
			y="92.77"
			width="20"
			height="70"
			transform="translate(105 -251.85) rotate(23.38)" />
		<rect
			class="cls-10"
			x="785.23"
			y="188.32"
			width="20"
			height="70"
			transform="translate(414.53 -509.71) rotate(46.87)" />
		<rect
			class="cls-10"
			x="873.13"
			y="334.37"
			width="20"
			height="70"
			transform="matrix(0.32, 0.95, -0.95, 0.32, 948.48, -585.66)" />
		<rect
			class="cls-11"
			x="891.65"
			y="506.14"
			width="20"
			height="70"
			transform="matrix(-0.1, 0.99, -0.99, -0.1, 1533.23, -299.65)" />
		<!-- Mode -->
		<text class="cls-12" transform="translate(423.06 946.01) scale(1.58 1)"
			>{mode == 0 ? 'km/h' : 'mp/h'}</text>
	</g>
	<g id="Small_Bars" data-name="Small Bars">
		<rect
			class="cls-10"
			x="412.31"
			y="67.61"
			width="10"
			height="45"
			transform="translate(-9.57 83.81) rotate(-11.34)" />
		<rect
			class="cls-10"
			x="254.68"
			y="134.07"
			width="10"
			height="45"
			transform="matrix(0.82, -0.57, 0.57, 0.82, -42.88, 176.71)" />
		<rect
			class="cls-10"
			x="139.17"
			y="260.24"
			width="10"
			height="45"
			transform="translate(-172.31 258.94) rotate(-58.68)" />
		<rect
			class="cls-10"
			x="81.9"
			y="429.6"
			width="10"
			height="45"
			transform="translate(-372.17 486.85) rotate(-83.45)" />
		<rect
			class="cls-10"
			x="99.24"
			y="608.61"
			width="10"
			height="45"
			transform="translate(-462.97 926.82) rotate(-108.16)" />
		<rect
			class="cls-10"
			x="579.56"
			y="67.81"
			width="10"
			height="45"
			transform="translate(30.51 -116.81) rotate(11.71)" />
		<rect
			class="cls-10"
			x="733.6"
			y="134.97"
			width="10"
			height="45"
			transform="translate(223.03 -394.35) rotate(34.91)" />
		<rect
			class="cls-10"
			x="851.86"
			y="262"
			width="10"
			height="45"
			transform="translate(658.37 -596.27) rotate(58.93)" />
		<rect
			class="cls-10"
			x="909.08"
			y="430.9"
			width="10"
			height="45"
			transform="matrix(0.11, 0.99, -0.99, 0.11, 1263.74, -505.16)" />
		<rect
			class="cls-11"
			x="889.85"
			y="608.87"
			width="10"
			height="45"
			transform="translate(1777.65 -16.75) rotate(108.51)" />
	</g>
	<g id="Gauge_Text" data-name="Gauge Text">
		<text class="cls-13" transform="translate(438.67 339.33) scale(1.07 1)">RPM</text>
		<text class="cls-14" transform="translate(441.25 368.14) scale(0.94 1)"
			>X<tspan class="cls-15" x="29.95" y="0">1</tspan>
			<tspan class="cls-16" x="50.73" y="0">000</tspan>
		</text>
		<text class="cls-17" transform="translate(203.14 683.28) scale(1.05 1)">0</text>
		<text class="cls-17" transform="translate(159.51 552.21) scale(1.05 1)">1</text>
		<text class="cls-17" transform="translate(178.19 430.95) scale(1.05 1)">2</text>
		<text class="cls-17" transform="translate(239.9 313.61) scale(1.05 1)">3</text>
		<text class="cls-17" transform="translate(341.9 224.51) scale(1.05 1)">4</text>
		<text class="cls-17" transform="translate(470.25 197.35) scale(1.05 1)">5</text>
		<text class="cls-17" transform="translate(591.78 226.05) scale(1.05 1)">6</text>
		<text class="cls-17" transform="translate(694.37 313.61) scale(1.05 1)">7</text>
		<text class="cls-17" transform="translate(756.66 431.49) scale(1.05 1)">8</text>
		<text class="cls-18" transform="translate(769.07 557.09) scale(1.05 1)">9</text>
		<text class="cls-19" transform="translate(676.5 669.42) scale(1.05 1)"
			>1<tspan class="cls-20" x="46.44" y="0">0</tspan>
		</text>
	</g>
	<g id="Speed">
		<rect class="cls-21" x="314.93" y="734.44" width="376.11" height="157.53" rx="6" />
		<!-- Speed Text-->
		<text class="cls-22" transform="translate(626 874.81) scale(0.88 1)" text-anchor="end"
			>{speedDisplayText}</text>
		<g id="GearBackground" class="cls-23">
			<text class="cls-24" transform="translate(457.92 695.4) scale(0.92 1)">8</text>
		</g>
		<!-- Gear Text -->
		<g id="Gear">
			<text class="cls-25" transform="translate(458.03 695.4) scale(0.92 1)">{gear}</text>
		</g>
		<!-- Zeiger -->
		<path
			transform="rotate({rot},500,500)"
			class="cls-3"
			d="M560.89,484.51,126.88,733a10,10,0,1,1-10.28-17.15L540.32,450.2a20,20,0,0,1,20.57,34.31" />
	</g>
</svg>

<style>
	.cssistcomplex {
		mask-image: radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 1) 60%, rgba(0, 188, 212, 0) 75%);
	}
</style>
