// quadtree.js

class Rectangle {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    contains(point) {
        return (point.x >= this.x - this.width &&
                point.x <= this.x + this.width &&
                point.y >= this.y - this.height &&
                point.y <= this.y + this.height);
    }

    intersects(range) {
        return !(range.x - range.width > this.x + this.width ||
                 range.x + range.width < this.x - this.width ||
                 range.y - range.height > this.y + this.height ||
                 range.y + range.height < this.y - this.height);
    }
}

class Quadtree {
    constructor(boundary, capacity) {
        this.boundary = boundary;
        this.capacity = capacity;
        this.points = [];
        this.divided = false;
    }

    subdivide() {
        const { x, y, width, height } = this.boundary;
        const nw = new Rectangle(x - width / 2, y - height / 2, width / 2, height / 2);
        const ne = new Rectangle(x + width / 2, y - height / 2, width / 2, height / 2);
        const sw = new Rectangle(x - width / 2, y + height / 2, width / 2, height / 2);
        const se = new Rectangle(x + width / 2, y + height / 2, width / 2, height / 2);

        this.northwest = new Quadtree(nw, this.capacity);
        this.northeast = new Quadtree(ne, this.capacity);
        this.southwest = new Quadtree(sw, this.capacity);
        this.southeast = new Quadtree(se, this.capacity);

        this.divided = true;
    }

    insert(point) {
        if (!this.boundary.contains(point)) {
            return false;
        }

        if (this.points.length < this.capacity) {
            this.points.push(point);
            return true;
        } else {
            if (!this.divided) {
                this.subdivide();
            }

            if (this.northwest.insert(point) ||
                this.northeast.insert(point) ||
                this.southwest.insert(point) ||
                this.southeast.insert(point)) {
                return true;
            }
        }
    }

    query(range, found) {
        if (!found) {
            found = [];
        }

        if (!this.boundary.intersects(range)) {
            return found;
        } else {
            for (let p of this.points) {
                if (range.contains(p)) {
                    found.push(p);
                }
            }
            if (this.divided) {
                this.northwest.query(range, found);
                this.northeast.query(range, found);
                this.southwest.query(range, found);
                this.southeast.query(range, found);
            }
        }
        return found;
    }
}

export { Quadtree, Rectangle };