/**
 * Site title manager class
 *
 * @class
 */
export default class SiteTitle {
    /**
     * Class constructor
     *
     * @param {string} base
     * @param {string} segmentSeparator
     */
    constructor(base, segmentSeparator) {
        this.base = base;
        this.segmentSeparator = segmentSeparator;
        this.segments = [];
    }

    /**
     * Returns the full title
     *
     * @return {string}
     */
    get full() {
        let segments = this.segments;

        return this.base + (segments.length > 0 ? this.segmentSeparator + segments.join(this.segmentSeparator) : '');
    }

    /**
     * Sets only the current title title, reseting the last added segments
     *
     * @param {string} title
     */
    set(title) {
        this.reset();
        this.push(title);
    }

    /**
     * Pushes a segment to the title
     *
     * @param {string} segment
     */
    push(segment) {
        this.segments.push(segment);
    }

    /**
     * Pops a segment from the title
     *
     * @return {string}
     */
    pop() {
        return this.segments.pop();
    }

    /**
     * Resets the title segments
     */
    reset() {
        this.segments = [];
    }

    /**
     * Overriding the toString method to call the method 'get'
     *
     * @return {string}
     */
    toString() {
        return this.full;
    }
}