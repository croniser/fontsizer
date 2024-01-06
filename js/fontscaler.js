/**
 * FontSizer class for adjusting font size of an element to fit within its parent container or css height variables
 * @class
 * @author: G. Croniser
 * @version 0.1.0
 *
 */
export default class FontScaler {
    _target;
    _settings = {
        heightVar: "--fontScalerHeight",
        maxIterations: 500,
        maxIterationsErrorMessage: "FontScaler max iterations exceeded",
        invalidTargetErrorMessage: "Invalid target element",
        invalidHeightErrorMessage: "Invalid height variable"
    };
    _maxHeight = 0;
    _iterations = 0;
    _clone;
    _fontSize;
    _animationFrame;

    /**
     * The constructor initializes the TextSizer instance by validating the target element and assigning settings.
     * It then binds events and sets up the necessary functionality.
     * @param {HTMLElement} target the element to adjust the font size
     * @param {Object} settings={} overridable config options
     */
    constructor(target, settings = {}) {
        if (!(target instanceof Element)) {
            throw new Error(this._settings.invalidTargetErrorMessage);
        }
        this._target = target;
        Object.assign(this._settings, settings);
        this.bindEvents();
    }

    /**
     * Update the maximum height based on the computed style of the target element or its parent.
     * @throws {Error} if maxHeight cannot be determined
     */
    updateHeight() {
        this._maxHeight = getComputedStyle(this._target).getPropertyValue(this._settings.heightVar)
            || this._target.parentElement.clientHeight;
        if (!this._maxHeight) {
            throw new Error(this._settings.invalidHeightErrorMessage);
        }
    }

    /**
     * Create a deep clone of the target element and append it to the DOM.  Set it's width equal to original due to the absolute positioning
     */
    initClone() {
        this._fontSize = parseFloat(parseFloat(getComputedStyle(this._target).getPropertyValue("font-size")));
        this._clone = this._target.cloneNode(true);
        this._clone.style.position = "absolute";
        this._clone.style.width = this._target.offsetWidth + "px";
        this._target.parentElement.insertBefore(this._clone, this._target.nextSibling);
    }

    /**
     * Bind listeners page load and resize events
     */
    bindEvents() {
        document.addEventListener("DOMContentLoaded", () => this.debounce());
        document.fonts && document.fonts.ready.then(() => this.debounce());
        window.addEventListener("resize", () => this.debounce());
    }

    /**
     * Test if the cloned element's height exceeds the maximum height
     * @returns {boolean} true if the clone is taller than maxHeight
     */
    isTextTooLarge() {
        return this._clone.offsetHeight > this._maxHeight;
    }

    /**
     * Increment the loop counter and test if it exceeds the maximum iterations
     * @throws {Error} if the max iterations are exceeded to prevent infinite loops
     */
    countLoop() {
        if (++this._iterations >= this._settings.maxIterations) {
            throw new Error(this._settings.maxIterationsErrorMessage);
        }
    }

    /**
     * Decrement the font size of the cloned element
     */
    decrementFontSize() {
        this.countLoop();
        this._clone.style.fontSize = --this._fontSize + "px";
    }

    /**
     * Increment the font size of the cloned element
     */
    incrementFontSize() {
        this.countLoop();
        this._clone.style.fontSize = ++this._fontSize + "px";
    }

    /**
     * Increase the font size until the cloned element's height exceeds the maximum height
     */
    growText() {
        this.incrementFontSize();
        this.isTextTooLarge()
            ? this.decrementFontSize()
            : this.growText();
    }

    /**
     * Decrease the font size until the cloned element's height is within the maximum height
     */
    shrinkText() {
        this.decrementFontSize();
        this.isTextTooLarge() && this.shrinkText();
    }

    /**
     * Synchronize the font size of the target element with the adjusted font size
     */
    syncFontSize() {
        this._target.style.fontSize = this._fontSize + "px";
        this._clone.parentNode.removeChild(this._clone);
    }

    /**
     * Trigger the font size adjustment process
     * @throws {error} catch all arouned font sizing loops
     */
    execute() {
        try {
            this._iterations = 0;
            this.updateHeight();
            this.initClone();
            this.isTextTooLarge()
                ? this.shrinkText()
                : this.growText();
            this.syncFontSize();
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Red uce the number of calls to when the window is repainted, ~66ms
     */
    debounce() {
        this._animationFrame && window.cancelAnimationFrame(this._animationFrame);
        this._animationFrame = window.requestAnimationFrame(() => this.execute());
    }

}