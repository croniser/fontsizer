# FontScaler

Scale an HTML element's font-size to it's parent or to custom height values.  The target will scale to the largest font-size before growing or line wrapping beyond the desired height.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Installation

Import the fontscaler.js module.  Instantiate instances with an html element:

```new FontScaler(document.querySelector('p'));```

## Usage

By default the target will grow or shrink its font-size to fit within it's parent.  For custom heights, CSS variables can be provided within the selector for the target.  Media queries can be used to provide different heights at different viewport sizes.  Font sizes are provided in px units:

```--fontScalerHeight: 300; ```

## License

[MIT License](./LICENSE)