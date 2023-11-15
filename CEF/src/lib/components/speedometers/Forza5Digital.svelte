<script>
  export let gear = 0;
  export let speed = 30;
  export let rpm = 500;
  export let mode = 0;

  $: rpmPX = Math.min(((rpm * 100) / 9000) * 1000 * 42, 425);

  //ADJUSTABLE PROPERTIES

  //Colors
  //Digits
  let DIGIT_ON = '#FFFFFF';
  let DIGIT_OFF = 'rgb(170,170,170,0.5';
  let SHADOW_COLOR = 'rgb(50,50,50,0.6';
  //Unit text
  let KMH = 'rgb(170,170,170,0.5)';
  let UNDERLINE = 'rgb(170,170,170,0.5)';
  //Gear
  let RING = 'rgb(170,170,170,0.3)';
  let GEAR = 'rgb(255,255,255)';
  let GEAR_DANGER = 'rgb(182,47,78)';
  //Bar
  let BAR_LOWERGRADIENT = 'rgb(140,140,140,0.5)';
  let BAR_HIGHGRADIENT = 'rgb(200,200,200)';
  let BAR_BACKGROUND = 'rgb(110,110,110,0.5)';
  let BAR_DANGER = 'rgb(182,47,78,0.5)';
  let BAR_DANGER_HIGHLIGHT = 'rgb(182,47,78)';
  let INDICATORBASE = 'rgb(255,255,255)';
  let INDICATORGLOW = 'rgb(255,255,255)';

  //Meta
  //Length of the red Bar
  //Complete Bar length W/O rounded cap: 425
  let RPM_DANGER_LENGTH = 50;

  //ADJUSTABLE END

  //Danger Bar Calc
  $: barLeftLength = 425 - RPM_DANGER_LENGTH;

  //Digits
  $: digits = speedToCharArray(speed);
  function speedToCharArray(speed) {
    const speedString = String(speed);
    if (speed < 10) {
      return ['0', '0', speedString.charAt(0)];
    }
    if (speed < 100) {
      return ['0', speedString.charAt(0), speedString.charAt(1)];
    }
    return [speedString.charAt(0), speedString.charAt(1), speedString.charAt(2)];
  }

  function getDigitColorString(digits, digit) {
    if (speed < 10) {
      if (digit < 3 || digits[2] === '0') return DIGIT_OFF;
      return DIGIT_ON;
    }
    if (speed < 100) {
      if (digit === 1) return DIGIT_OFF;
      return DIGIT_ON;
    }
    return DIGIT_ON;
  }

  //Gear
  $: isGearDanger = rpmPX >= 425 - RPM_DANGER_LENGTH;
</script>

<svg viewBox="0 -29.17 490 290.17" xmlns="http://www.w3.org/2000/svg">
  <ellipse
    style="stroke-width: 4px;"
    fill="none"
    stroke={isGearDanger ? GEAR_DANGER : RING}
    cx="90"
    cy="146"
    rx="45"
    ry="45"
  >
    <title>Gear Ring</title>
  </ellipse>
  <filter id="shadow">
    <feDropShadow dx="0.1" dy="0.2" stdDeviation="0.9" flood-color={SHADOW_COLOR} />
  </filter>
  <text
    style="font-family: Oswald; font-size: 63px; font-style: italic; font-weight: 400; text-anchor: middle; white-space: pre;"
    fill={isGearDanger ? GEAR_DANGER : GEAR}
    filter="url(#shadow)"
    x="83.412"
    y="171.199"><title>Gear Text</title>{gear}</text
  >
  <text
    style="font-family: Oswald; font-size: 32px; font-style: italic; font-weight: 200; white-space: pre;"
    fill={getDigitColorString(digits, 1)}
    filter="url(#shadow)"
    x="182"
    y="116.276"
    transform="matrix(5.258381, 0, 0, 5.753161, -820.02533, -478.398193)"><title>Speed Digit 1</title>{digits[0]}</text
  >
  <text
    style="font-family: Oswald; font-size: 32px; font-style: italic; font-weight: 200; white-space: pre;"
    filter="url(#shadow)"
    fill={getDigitColorString(digits, 2)}
    x="182"
    y="116.276"
    transform="matrix(5.258381, 0, 0, 5.753161, -737.02533, -478.398193)"><title>Speed Digit 2</title>{digits[1]}</text
  >
  <text
    style="font-family: Oswald; font-size: 32px; font-style: italic;  font-weight: 200; white-space: pre;"
    filter="url(#shadow)"
    fill={getDigitColorString(digits, 3)}
    x="182"
    y="116.276"
    transform="matrix(5.258381, 0, 0, 5.753161, -654.02533, -477.398193)"><title>Speed Digit 3</title>{digits[2]}</text
  >
  <text
    style="font-family: Asap; font-size: 27.5677px; font-style: italic; font-weight: 600; line-height: 45.3335px; white-space: pre;"
    fill={KMH}
    transform="matrix(1, 0, 0, 1.305877, 0, -55.664062)"
    x="411"
    y="184"><title>KMH</title>{mode == 0 ? 'KMH' : 'MPH'}</text
  >
  <line style="stroke-width: 3px; stroke-linecap: round;" stroke={UNDERLINE} x1="411" y1="191" x2="468.5" y2="191">
    <title>KMHUnderline</title>
  </line>
  <!-- Bar background-->
  <path
    d="m 42 200 l {barLeftLength} 0 l -5 25 l -{barLeftLength} 0 q -5 0 -4 -5 l 3 -15 q 1 -5 6 -5"
    fill={BAR_BACKGROUND}
  />
  <!-- Bar Highlight-->
  <defs>
    <linearGradient
      id="HighlightGradient"
      x1="35"
      y1="200"
      x2={Math.min(35 + rpmPX, 35 + barLeftLength)}
      y2="210"
      gradientUnits="userSpaceOnUse"
    >
      <stop stop-color={BAR_LOWERGRADIENT} offset="0" />
      <stop stop-color={BAR_HIGHGRADIENT} offset="1" />
    </linearGradient>
  </defs>
  <path
    d="m 42 200 l {Math.min(rpmPX, barLeftLength)} 0 l -5 25 l -{Math.min(
      rpmPX,
      barLeftLength
    )} 0 q -5 0 -4 -5 l 3 -15 q 1 -5 6 -5"
    fill="url(#HighlightGradient)"
  />
  <!-- Bar danger-->
  <path
    d="m {42 + barLeftLength} 200 l {RPM_DANGER_LENGTH} 0 q 3 0 3 3 l 0 19 q 0 3 -3 3 l -{5 + RPM_DANGER_LENGTH} 0"
    fill={BAR_DANGER}
  />
  <!-- Danger Highlight -->
  <path
    d="m {42 + barLeftLength} 200 l {Math.max(rpmPX - barLeftLength, 0)} 0 l -5 25 l -{Math.max(
      rpmPX - barLeftLength,
      0
    )} 0 l 3 -15"
    fill={BAR_DANGER_HIGHLIGHT}
  />
  <!-- Bar Inicator-->
  <path d="m {37 + rpmPX} 200 l 5 0 l -5 25 l -5 0" fill={INDICATORBASE} />
  <!-- Indicator Glow-->
  <filter id="indicatorBlur" x="-50%" width="200%" y="-20%" height="170%">
    <feGaussianBlur stdDeviation="3" />
  </filter>
  <path filter="url(#indicatorBlur)" d="m {37 + rpmPX} 200 l 5 0 l -5 25 l -5 0" fill={INDICATORGLOW} />
</svg>
