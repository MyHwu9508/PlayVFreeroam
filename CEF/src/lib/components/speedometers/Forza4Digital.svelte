<script>
    //Max Value for pins 42
    import { tweened } from 'svelte/motion'
    import { linear } from 'svelte/easing'
    import { onDestroy } from 'svelte';
    const PIN_OFFSET = 14.3;
    const DARK_GREY_RGB = 100;
    const DARK_OPACITY = 0.5;
    const DARK_GREY_STRING = `${DARK_GREY_RGB},${DARK_GREY_RGB},${DARK_GREY_RGB},${DARK_OPACITY}`;

    export let gear;
    export let speed = 1;
    export let rpm = 0.2;
    export let mode = 0;

    let activePins = 0;

    $: speedDigits = digitInttoStrings(speed);
    $: refreshActivePins(rpm);

    function refreshActivePins(rpm){
        const newActivePins =  (rpm*100 / 9000)*100 * 42;
        activePins = newActivePins > 42 ? 42: newActivePins;
    }

    function getPinColorString(index, activePins) {
        if (index > activePins) return DARK_GREY_STRING;
        const color = 130 + index * (125 / activePins);
        return `${color},${color},${color},${0.6 + index * (0.4 / activePins)}`;
    }

    function getGearColorString(activePins) {
        if (activePins > 41 ) return '210, 60, 90';
        if(gear == 'N')return DARK_GREY_STRING;
        return '36, 148, 90';
    }

    function getDigitColorString(digits, digit) {
        if (speed < 10) {
            if (digit < 3 || digits[2] === '0') return DARK_GREY_STRING;
            return '255,255,255';
        }
        if (speed < 100){
            if (digit === 1) return DARK_GREY_STRING;
            return '255,255,255';
        }
        return '255,255,255';
    }

    function digitInttoStrings(speed) {
        const speedString = String(speed);
        if (speed < 10 ) {
            return ['0', '0', speedString.charAt(0)];
        }
        if (speed < 100 ) {
            return ['0', speedString.charAt(0), speedString.charAt(1)];
        }
        return [speedString.charAt(0), speedString.charAt(1), speedString.charAt(2)];
    }
</script>

<svg viewBox="263.224 50.046 757.757 489.982" xmlns="http://www.w3.org/2000/svg">
    <ellipse style="fill: none; stroke: rgb({getGearColorString(activePins)}); stroke-width: 7px;" cx="345" cy="362" rx="65" ry="65">
        <title>Gear Ring</title>
    </ellipse>
    <text
        style="fill: rgb({getGearColorString(activePins)}); font-family: 'Oswald'; font-style: italic; font-size: 110px; white-space: pre; text-anchor: middle;"
        x="335"
        y="400"
        transform="matrix(1, 0, 0, 0.859699, 0, 54.835201)"><title>Gear</title>{gear}</text
    >
    <text
        style="fill: rgb({getDigitColorString(speedDigits, 3)});font-family: Oswald; font-weight:300; font-size: 221px; font-style: italic; text-anchor: middle; white-space: pre;"
        transform="matrix(1.361103, 0, 0, 1.495456, 145.761597, -214.717682)"
        x="468"
        y="440.769"><title>Speed Digit 3</title>{speedDigits[2]}</text
    >
    <text
        style="fill: rgb({getDigitColorString(speedDigits, 2)}); font-family: Oswald; font-weight:300; font-size: 221px; font-style: italic; text-anchor: middle; white-space: pre;"
        transform="matrix(1.317652, 0, 0, 1.495456, 23.614737, -214.717682)"
        x="468"
        y="440.769"><title>Speed Digit 2</title>{speedDigits[1]}</text
    >
    <text
        style="fill: rgb({getDigitColorString(speedDigits, 1)}); font-family: Oswald; font-weight:300; font-size: 221px; font-style: italic; text-anchor: middle; white-space: pre;"
        transform="matrix(1.295944, 0, 0, 1.495456, -109.465935, -214.717682)"
        x="468"
        y="440.769"><title>Speed Digit 1</title>{speedDigits[0]}</text
    >
    >
    <text
        style="fill: rgb({DARK_GREY_STRING}); font-family: Oswald; font-size: 41.5px; font-style: italic; font-weight: 700; white-space: pre;"
        transform="matrix(1.11327, 0, 0, 1.127155, -104.321404, -31.802149)"
        x="921"
        y="222.244"><title>KMH</title>{mode == 0 ? 'KMH': 'MPH'}</text
    >
    <text
        style="fill: rgb({DARK_GREY_STRING}); font-family: Oswald; font-size: 41.5px; font-style: italic; font-weight: 700; white-space: pre;"
        x="909.221"
        y="344.244"><title>ABS</title>ABS</text
    >
    <text
        style="fill: rgb({DARK_GREY_STRING}); font-family: Oswald; font-size: 41.5px; font-style: italic; font-weight: 700; letter-spacing: 2.2px; white-space: pre;"
        transform="matrix(1.078961, 0, 0, 1, -73.985855, 0)"
        x="899"
        y="391.244"><title>TCR</title>TCR</text
    >
    <text
        style="fill: rgb({DARK_GREY_STRING}); font-family: Oswald; font-size: 41.5px; font-style: italic; font-weight: 700; white-space: pre;"
        x="885"
        y="442.244"><title>STM</title>STM</text
    >
    <!-- 43 Pins -->
    {#each Array(43) as _, index (index)}
        <polyline
            style="fill: rgb({getPinColorString(index, activePins)}); stroke: rgb(45,45,45);"
            stroke-width="0.3"
            points={`${275 + index * PIN_OFFSET} 465 ${270 + index * PIN_OFFSET} 505 ${280 +
                index * PIN_OFFSET} 505 ${285 + index * PIN_OFFSET} 465`}
        >
            <title>RPM</title>
        </polyline>
    {/each}
    {#each Array(5) as _, index (index)}
        <polyline
            style="fill: rgb(198, 45, 79);"
            points={`${890 + index * PIN_OFFSET} 465 ${883 + index * PIN_OFFSET} 520 ${893 +
                index * PIN_OFFSET} 520 ${900 + index * PIN_OFFSET} 465`}
        >
            <title>RPMRed</title>
        </polyline>
    {/each}
    <line
        style="fill: rgb(216, 216, 216); stroke: rgb({DARK_GREY_STRING}); stroke-width: 10px;"
        x1="270"
        y1="515"
        x2="880"
        y2="515"
    >
        <title>LineBG</title>
    </line>
    <defs>
        <linearGradient id="greydient" x1="270" y1="515" x2="{275 + activePins * (PIN_OFFSET)}" y2="515" gradientUnits="userSpaceOnUse">
            <stop stop-color="rgb(130,130,130,0.6)" offset="0" />
            <stop stop-color="white" offset="1" />
        </linearGradient>
    </defs>
    <line
        style="stroke-width: 10px; stroke: url(#greydient);"
        x1="270"
        y1="515"
        x2="{275 + activePins * (PIN_OFFSET)}"
        y2="515"
    >
        <title>LineDef</title>
    </line>
    <filter id="blurStrong">
        <feGaussianBlur in="SourceGraphic" x="270" y="505" width="610" height="20" stdDeviation="3" />
    </filter>
    <filter id="blurWeak">
        <feGaussianBlur in="SourceGraphic" x="270" y="505" width="610" height="20" stdDeviation="1" />
    </filter>
    <ellipse cx="{275 + activePins * (PIN_OFFSET)}" cy="515" rx="6" ry="8" filter="url(#blurWeak)" fill="white" />
    <ellipse cx="{275 + activePins * (PIN_OFFSET)}" cy="515" rx="18" ry="9" filter="url(#blurStrong)" opacity="0.7" fill="white" />
</svg>
