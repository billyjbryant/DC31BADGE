class Msg {
  constructor(t, e, s) {
    (this.message = t),
      (this.options = {
        type: "error",
        title: "Error!",
        on_close: () => {},
        ...e,
      }),
      (this.is_visible = !1),
      (this.buttons = s || [
        {
          text: "OK",
          on_click: () => {
            this.hide_dialog();
          },
        },
      ]),
      this.show_dialog();
  }
  show_dialog() {
    const t = document.getElementById("msg_dialog"),
      e = document.getElementById("title"),
      s = document.getElementById("message"),
      o = document.getElementById("buttons");
    t.classList.add(this.options.type + "-dialog"),
      (e.textContent = this.options.title),
      (s.textContent = this.message),
      (o.innerHTML = "");
    for (const t of this.buttons) {
      const e = document.createElement("button");
      (e.textContent = t.text),
        e.addEventListener("click", t.on_click),
        o.appendChild(e);
    }
    (t.style.top = "100px"),
      (t.style.display = "block"),
      (this.is_visible = !0);
  }
  hide_dialog() {
    this.is_visible = !1;
    const t = document.getElementById("msg_dialog");
    (t.style.top = "-100px"),
      this.options.on_close(),
      setTimeout(() => {
        (t.style.display = "none"), (t.className = "");
      }, 300);
  }
}
class Calcs {
  constructor(t) {
    this.parent = t;
  }
  async async_map_canvas_to_pattern_xy(t, n, o, a) {
    return this.map_canvas_to_pattern_xy(t, n, o, a);
  }
  map_canvas_to_pattern_xy(t, n, o, a) {
    const e = [
      (t - this.parent.map.pattern_offset_x) / this.parent.map.pattern_scale -
        Math.abs(this.parent.map.min_x),
      (n - this.parent.map.pattern_offset_y) / this.parent.map.pattern_scale -
        Math.abs(this.parent.map.min_y),
    ];
    return o
      ? [Math.round(e[0]), Math.round(e[1])]
      : a
      ? [this.round_to_tolerance(e[0]), this.round_to_tolerance(e[1])]
      : e;
  }
  async async_pattern_to_map_canvas_xy(t, n, o, a) {
    return this.pattern_to_map_canvas_xy(t, n, o, a);
  }
  pattern_to_map_canvas_xy(t, n, o, a) {
    const e = [
      (t + Math.abs(this.parent.map.min_x)) * this.parent.map.pattern_scale +
        this.parent.map.pattern_offset_x,
      (n + Math.abs(this.parent.map.min_y)) * this.parent.map.pattern_scale +
        this.parent.map.pattern_offset_y,
    ];
    return o
      ? [Math.round(e[0]), Math.round(e[1])]
      : a
      ? [this.round_to_tolerance(e[0]), this.round_to_tolerance(e[1])]
      : e;
  }
  async async_zoom_canvas_to_pattern_xy(t, n, o, a) {
    return this.zoom_canvas_to_pattern_xy(t, n, o, a);
  }
  zoom_canvas_to_pattern_xy(t, n, o, a) {
    const e = [
      (t - this.parent.zoom.can_w / 2 + this.parent.zoom_target[0]) /
        this.parent.zoom_zoom,
      (n - this.parent.zoom.can_h / 2 + this.parent.zoom_target[1]) /
        this.parent.zoom_zoom,
    ];
    return o
      ? [Math.round(e[0]), Math.round(e[1])]
      : a
      ? [this.round_to_tolerance(e[0]), this.round_to_tolerance(e[1])]
      : e;
  }
  async async_pattern_to_zoom_canvas_xy(t, n, o, a) {
    return this.pattern_to_zoom_canvas_xy(t, n, o, a);
  }
  pattern_to_zoom_canvas_xy(t, n, o, a) {
    const e = [
      t * this.parent.zoom_zoom +
        this.parent.zoom.can_w / 2 -
        this.parent.zoom_target[0],
      n * this.parent.zoom_zoom +
        this.parent.zoom.can_h / 2 -
        this.parent.zoom_target[1],
    ];
    return o
      ? [Math.round(e[0]), Math.round(e[1])]
      : a
      ? [this.round_to_tolerance(e[0]), this.round_to_tolerance(e[1])]
      : e;
  }
  dot_product(t, n) {
    return t[0] * n[0] + t[1] * n[1];
  }
  perpendicular_vector(t) {
    return [-t[1], t[0]];
  }
  project_polygon(t, n) {
    const o = Math.sqrt(n[0] * n[0] + n[1] * n[1]),
      a = [n[0] / o, n[1] / o];
    let e = this.dot_product(t[0], a),
      r = e;
    for (let n = 1; n < t.length; n++) {
      const o = this.dot_product(t[n], a);
      o < e ? (e = o) : o > r && (r = o);
    }
    return {
      min: e,
      max: r,
    };
  }
  overlap(t, n) {
    const o = t.map((t) => [Math.round(t[0]), Math.round(t[1])]),
      a = n.map((t) => [Math.round(t[0]), Math.round(t[1])]);
    for (let t = 0; t < o.length; t++) {
      const n = o[t],
        e = o[(t + 1) % o.length],
        r = this.perpendicular_vector([e[0] - n[0], e[1] - n[1]]),
        s = Math.sqrt(r[0] * r[0] + r[1] * r[1]),
        _ = [r[0] / s, r[1] / s],
        h = this.project_polygon(o, _),
        i = this.project_polygon(a, _);
      if (h.max < i.min || i.max < h.min) return !1;
    }
    for (let t = 0; t < a.length; t++) {
      const n = a[t],
        e = a[(t + 1) % a.length],
        r = this.perpendicular_vector([e[0] - n[0], e[1] - n[1]]),
        s = Math.sqrt(r[0] * r[0] + r[1] * r[1]),
        _ = [r[0] / s, r[1] / s],
        h = this.project_polygon(o, _),
        i = this.project_polygon(a, _);
      if (h.max < i.min || i.max < h.min) return !1;
    }
    return !0;
  }
  are_edges_equal(t, n) {
    return (
      (this.round_to_tolerance(t[0][0]) === this.round_to_tolerance(n[0][0]) &&
        this.round_to_tolerance(t[0][1]) === this.round_to_tolerance(n[0][1]) &&
        this.round_to_tolerance(t[1][0]) === this.round_to_tolerance(n[1][0]) &&
        this.round_to_tolerance(t[1][1]) ===
          this.round_to_tolerance(n[1][1])) ||
      (this.round_to_tolerance(t[0][0]) === this.round_to_tolerance(n[1][0]) &&
        this.round_to_tolerance(t[0][1]) === this.round_to_tolerance(n[1][1]) &&
        this.round_to_tolerance(t[1][0]) === this.round_to_tolerance(n[0][0]) &&
        this.round_to_tolerance(t[1][1]) === this.round_to_tolerance(n[0][1]))
    );
  }
  edges(t) {
    const n = [];
    for (let o = 0; o < t.length; o++) n.push([t[o], t[(o + 1) % t.length]]);
    return n;
  }
  share_side(t, n) {
    const o = this.edges(t),
      a = this.edges(n);
    let e = 0;
    for (const t of o) for (const n of a) this.are_edges_equal(t, n) && e++;
    return e;
  }
  angle_between_pts_with_center(t, n, o) {
    let a = Math.atan2(n[1] - t[1], n[0] - t[0]),
      e = Math.atan2(o[1] - t[1], o[0] - t[0]);
    for (; a < 0; ) a += 2 * Math.PI;
    for (; e < 0; ) e += 2 * Math.PI;
    let r = e - a;
    return r <= 0 && (r += 2 * Math.PI), (180 * r) / Math.PI;
  }
  angle_of_line(t, n, o, a) {
    const e = o - t,
      r = a - n;
    return (Math.atan2(r, e) * (180 / Math.PI) + 360) % 360;
  }
  midpoint(t, n, o, a) {
    return [(t + o) / 2, (n + a) / 2];
  }
  floating_element_position(t, n, o, a, e) {
    const r = t.canvas.width,
      s = t.canvas.height;
    let _ = n.min_x,
      h = n.max_x,
      i = n.min_y,
      c = n.max_y;
    const p = Math.abs(n.max_x - n.min_x),
      l = Math.abs(n.max_y - n.min_y);
    if ("zoom" === e) {
      const t = this.pattern_to_zoom_canvas_xy(_, i),
        n = this.pattern_to_zoom_canvas_xy(h, c);
      (_ = t[0]), (i = t[1]), (h = n[0]), (c = n[1]);
    } else if ("map" === e) {
      const t = this.pattern_to_map_canvas_xy(_, i),
        n = this.pattern_to_map_canvas_xy(h, c);
      (_ = t[0]), (i = t[1]), (h = n[0]), (c = n[1]);
    }
    const u = {
        above: {
          h: i,
          w: r,
        },
        left: {
          h: s,
          w: _,
        },
        right: {
          h: s,
          w: r - h,
        },
        below: {
          h: s - c,
          w: r,
        },
      },
      m = ["above", "left", "right", "below"];
    let d,
      M,
      y = null;
    for (const t of m)
      if (u[t].h >= a && u[t].w >= o) {
        y = t;
        break;
      }
    switch ((null === y && (y = "above"), y)) {
      case "above":
        (d = _ + p / 2), (M = i - a / 2);
        break;
      case "left":
        (d = _ - o / 2), (M = i + l / 2);
        break;
      case "right":
        (d = h + o / 2), (M = i + l / 2);
        break;
      case "below":
        (d = _ + p / 2), (M = c + a / 2);
        break;
    }
    return (
      d < p / 2 && (d = p / 2),
      d > r - p / 2 && (d = r - p / 2),
      M < l / 2 && (M = l / 2),
      M > s - l / 2 && (M = s - l / 2),
      "zoom" === e
        ? this.zoom_canvas_to_pattern_xy(d, M)
        : "map" === e
        ? this.map_canvas_to_pattern_xy(d, M)
        : [d, M]
    );
  }
  round_to_tolerance(t) {
    return (
      Math.round(t / this.parent.point_tolerance) * this.parent.point_tolerance
    );
  }
  rotate_polygon(t, n, o) {
    let a = [];
    for (let e = 0; e < t.length; e++) {
      const r = t[e],
        s = this.rotate_point(r, t[n], o);
      a.push(s);
    }
    return a;
  }
  rotate_point(t, n, o) {
    const a = o * (Math.PI / 180),
      e = Math.cos(a),
      r = Math.sin(a);
    return [
      e * (t[0] - n[0]) - r * (t[1] - n[1]) + n[0],
      r * (t[0] - n[0]) + e * (t[1] - n[1]) + n[1],
    ];
  }
  rotate_points(t, n, o) {
    const a = (o * Math.PI) / 180,
      e = [];
    for (const o of n) {
      const n = Math.sqrt(Math.pow(o[0] - t[0], 2) + Math.pow(o[1] - t[1], 2)),
        r = Math.atan2(o[1] - t[1], o[0] - t[0]) + a,
        s = t[0] + n * Math.cos(r),
        _ = t[1] + n * Math.sin(r);
      e.push([s, _]);
    }
    return e;
  }
  move_point_towards(t, n, o, a, e) {
    const r = o - t,
      s = a - n,
      _ = Math.sqrt(r * r + s * s);
    if (0 === _) return [t, n];
    const h = e / _;
    return [t + r * h, n + s * h];
  }
  shrink_vertices(t, n, o, a) {
    let e = [];
    for (let r = 0; r < t.length; r++)
      e[r] = [
        n > t[r][0] ? t[r][0] + a : t[r][0] - a,
        o > t[r][1] ? t[r][1] + a : t[r][1] - a,
      ];
    return e;
  }
  center(t) {
    let n = 0,
      o = 0;
    const a = t.length;
    for (let e = 0; e < a; e++) (n += t[e][0]), (o += t[e][1]);
    return [n / a, o / a];
  }
  shrink_polygon(t, n) {
    const o = this.center(t);
    let a = [];
    for (let e = 0; e < t.length; e++) {
      const r = t[e],
        s = [o[0] - r[0], o[1] - r[1]],
        _ = Math.sqrt(s[0] ** 2 + s[1] ** 2),
        h = [s[0] / _, s[1] / _];
      a.push([r[0] + h[0] * n, r[1] + h[1] * n]);
    }
    return a;
  }
  bounding_box(t) {
    let n = t[0][0],
      o = t[0][0],
      a = t[0][1],
      e = t[0][1];
    for (var r = 1; r < t.length; r++) {
      const [s, _] = t[r];
      (n = Math.min(n, s)),
        (o = Math.max(o, s)),
        (a = Math.min(a, _)),
        (e = Math.max(e, _));
    }
    return {
      min_x: n,
      max_x: o,
      min_y: a,
      max_y: e,
      width: o - n,
      height: e - a,
    };
  }
  vertices(t, n, o) {
    const a = (n * Math.PI) / 180,
      e = Math.sqrt(2 * Math.pow(t, 2) + 2 * Math.pow(t, 2) * Math.cos(a)),
      r = Math.sqrt(2 * Math.pow(t, 2) - 2 * Math.pow(t, 2) * Math.cos(a));
    return {
      height: e,
      width: r,
      vertices: [
        [o[0], o[1] + e / 2],
        [o[0] + r / 2, o[1]],
        [o[0], o[1] - e / 2],
        [o[0] - r / 2, o[1]],
      ],
    };
  }
  async point_in_polygon(t, n, o, a) {
    let e = !1;
    a || (a = this.bounding_box(o));
    const { min_x: r, max_x: s, min_y: _, max_y: h } = a;
    if (t < r || t > s || n < _ || n > h) return "outside bounding box";
    for (let a = 0, r = o.length - 1; a < o.length; r = a++) {
      const s = o[a],
        _ = o[r],
        h = s[0],
        i = s[1],
        c = _[0],
        p = _[1];
      i > n != p > n && t < ((c - h) * (n - i)) / (p - i) + h && (e = !e);
    }
    return !1 === e ? "outside vertices" : "inside";
  }
  async closest_point(t, n, o, a) {
    if ("object" != typeof o || null === o || 0 === Object.keys(o).length)
      return null;
    let e = Object.keys(o)[0],
      r = o[e],
      s = await this.async_distance_squared(t, n, r[0], r[1]);
    for (const a in o) {
      const _ = o[a],
        h = await this.async_distance_squared(t, n, _[0], _[1]);
      h < s && ((e = a), (r = _), (s = h));
    }
    const _ = Math.sqrt(s);
    return a && _ > a ? null : e;
  }
  distance_squared(t, n, o, a) {
    const e = t.toFixed(10) - o.toFixed(10),
      r = n.toFixed(10) - a.toFixed(10);
    return e * e + r * r;
  }
  async async_distance_squared(t, n, o, a) {
    return this.distance_squared(t, n, o, a);
  }
  distance(t, n, o, a) {
    return Math.sqrt((o - t) ** 2 + (a - n) ** 2);
  }
}
class Obj {
  constructor(i, t) {
    (this.parent = i),
      (this.options = {
        x: null,
        y: null,
        o: 0,
        move_x: 0,
        move_y: 0,
        margin: 0,
        width: null,
        height: null,
        top_angle: null,
        side_length: null,
        shape: "polygon",
        x_orientation: "center",
        y_orientation: "center",
        pattern_to_canvas: !0,
        render_canvas_name: null,
        render_order_category: null,
        render_id: null,
        render_enabled: !0,
        click: !1,
        hover: !1,
        z_index: null,
        ...t,
      }),
      (this.is_selected = !1),
      (this.is_visible = !1),
      0 !== this.options.o &&
        "rectangle" === this.options.shape &&
        ((this.options.shape = "polygon"),
        (this.options.top_angle = 90),
        (this.options.side_length = this.options.width),
        (this.options.o = this.options.o + 45)),
      (this.options.o =
        this.options.o > 360 ? 360 - this.options.o : this.options.o),
      (this.animations = {});
  }
  on_hover() {}
  on_click() {}
  update(i) {
    this.options = {
      ...this.options,
      ...i,
    };
  }
  place(i, t) {
    if (
      (void 0 === i &&
        this.options.container &&
        null !== this.options.container.options.x &&
        void 0 !== this.options.container.options.x &&
        (i = this.options.container.options.x),
      void 0 === t &&
        this.options.container &&
        null !== this.options.container.options.y &&
        void 0 !== this.options.container.options.y &&
        (t = this.options.container.options.y),
      void 0 !== i && void 0 !== t)
    ) {
      if (
        ((this.options.x = i + this.options.move_x),
        (this.options.y = t + this.options.move_y),
        "polygon" === this.options.shape &&
          null !== this.options.side_length &&
          null !== this.options.top_angle)
      ) {
        const i = this.parent.calc.vertices(
          this.options.side_length,
          this.options.top_angle,
          [this.options.x, this.options.y]
        );
        if (
          ((this.vertices = i.vertices),
          (this.options.width = i.width),
          (this.options.height = i.height),
          0 !== this.options.o &&
            (this.vertices = this.parent.calc.rotate_points(
              [this.options.x, this.options.y],
              this.vertices,
              this.options.o
            )),
          "left" === this.options.x_orientation)
        )
          (this.vertices[0][0] += i.width / 2),
            (this.vertices[1][0] += i.width / 2),
            (this.vertices[2][0] += i.width / 2),
            (this.vertices[3][0] += i.width / 2);
        else if ("right" === this.options.x_orientation) {
          const t = this.ctx.canvas.width;
          (this.vertices[0][0] = t - this.vertices[0][0] - i.width / 2),
            (this.vertices[1][0] = t - this.vertices[1][0] - i.width / 2),
            (this.vertices[2][0] = t - this.vertices[2][0] - i.width / 2),
            (this.vertices[3][0] = t - this.vertices[3][0] - i.width / 2);
        }
        if ("top" === this.options.y_orientation)
          (this.vertices[0][1] += i.height / 2),
            (this.vertices[1][1] += i.height / 2),
            (this.vertices[2][1] += i.height / 2),
            (this.vertices[3][1] += i.height / 2);
        else if ("bottom" === this.options.y_orientation) {
          const t = this.ctx.canvas.height;
          (this.vertices[0][1] = t - this.vertices[0][1] - i.height / 2),
            (this.vertices[1][1] = t - this.vertices[1][1] - i.height / 2),
            (this.vertices[2][1] = t - this.vertices[2][1] - i.height / 2),
            (this.vertices[3][1] = t - this.vertices[3][1] - i.height / 2);
        }
        this.bounding_box = this.parent.calc.bounding_box(this.vertices);
      } else {
        if (
          ((this.vertices = [
            [
              this.options.x - this.options.width / 2,
              this.options.y - this.options.height / 2,
            ],
            [
              this.options.x + this.options.width / 2,
              this.options.y - this.options.height / 2,
            ],
            [
              this.options.x + this.options.width / 2,
              this.options.y + this.options.height / 2,
            ],
            [
              this.options.x - this.options.width / 2,
              this.options.y + this.options.height / 2,
            ],
          ]),
          "left" === this.options.x_orientation)
        )
          (this.vertices[0][0] = this.options.x),
            (this.vertices[1][0] = this.options.x + this.options.width),
            (this.vertices[2][0] = this.options.x + this.options.width),
            (this.vertices[3][0] = this.options.x);
        else if ("right" === this.options.x_orientation) {
          const i = this.ctx.canvas.width;
          (this.vertices[0][0] = i - (this.options.x + this.options.width)),
            (this.vertices[1][0] = i - this.options.x),
            (this.vertices[2][0] = i - this.options.x),
            (this.vertices[3][0] = i - (this.options.x + this.options.width));
        }
        "top" === this.options.y_orientation &&
          ((this.vertices[0][1] = this.options.y),
          (this.vertices[1][1] = this.options.y + this.options.height),
          (this.vertices[2][1] = this.options.y + this.options.height),
          (this.vertices[3][1] = this.options.y)),
          (this.bounding_box = {
            min_x: this.vertices[0][0],
            min_y: this.vertices[0][1],
            max_x: this.vertices[2][0],
            max_y: this.vertices[2][1],
            width: this.options.width,
            height: this.options.height,
          });
      }
      (this.padding = {
        min_x: this.bounding_box.min_x - this.options.margin,
        min_y: this.bounding_box.min_y - this.options.margin,
        max_x: this.bounding_box.max_x + this.options.margin,
        max_y: this.bounding_box.max_y + this.options.margin,
      }),
        this.parent.debug;
    }
  }
  hide(i, t) {
    (this.is_visible = !1),
      this.parent.update_render_item(
        i || this.options.render_canvas_name,
        t || this.options.render_order_category,
        this.options.render_id + "*",
        {
          render_enabled: !1,
        }
      );
  }
  remove() {
    (this.is_visible = !1),
      this.parent.delete_render_item(
        this.options.render_canvas_name,
        this.options.render_order_category,
        this.options.render_id + "*"
      );
  }
  show() {
    (this.is_visible = !0),
      this.parent.update_render_item(
        this.options.render_canvas_name,
        this.options.render_order_category,
        this.options.render_id + "*",
        {
          render_enabled: !0,
        }
      );
  }
  float(i, t) {
    t = t || this.options.render_canvas_name;
    const s = this.parent.calc.floating_element_position(
      this.ctx,
      i,
      this.options.width +
        Math.abs(this.options.move_x) +
        2 * this.options.margin,
      this.options.height +
        Math.abs(this.options.move_y) +
        2 * this.options.margin,
      t
    );
    null !== s && this.place(s[0], s[1]);
  }
  async check_obj_visible_inside_rect(i, t, s, o) {
    const n = i - s / 2,
      e = t - o / 2,
      h = t + o / 2;
    return (
      !(i + s / 2 < this.bounding_box.min_x || this.bounding_box.max_x < n) &&
      !(h < this.bounding_box.min_y || this.bounding_box.max_y < e)
    );
  }
  async check_coord_inside_obj(i, t, s, o, n, e) {
    return new Promise((h, r) => {
      if (
        null !== this.options.x &&
        null !== this.options.y &&
        !1 !== this.is_visible
      ) {
        if (
          i > this.bounding_box.min_x &&
          i < this.bounding_box.max_x &&
          t > this.bounding_box.min_y &&
          t < this.bounding_box.max_y
        ) {
          n.beginPath(), n.moveTo(e[0][0], e[0][1]);
          for (let i = 1; i < e.length; i++) n.lineTo(e[i][0], e[i][1]);
          return (
            n.closePath(),
            n.isPointInPath(s, o) ? void h("inside") : void h("outside obj")
          );
        }
        h("outside bounding box");
      } else h("not placed");
    });
  }
  animate_start(i, t) {
    (this.animations[i] = {
      stop: !1,
      start_time: Date.now(),
      duration: 500,
      func: (i) => {},
      ...t,
    }),
      this.animate(i);
  }
  animate_stop(i) {
    this.animations[i] && (this.animations[i].stop = !0);
  }
  animate(i) {
    if (!this.animations[i]) return;
    const t = Date.now() - this.animations[i].start_time,
      s = Math.min(t / this.animations[i].duration, 1);
    this.animations[i].func(s),
      s < 1 &&
        !1 === this.animations[i].stop &&
        requestAnimationFrame(() => {
          this.animate(i);
        });
  }
  interpolate_color(i, t, s) {
    const o = Math.round(this.interpolate(i[0], t[0], s)),
      n = Math.round(this.interpolate(i[1], t[1], s)),
      e = Math.round(this.interpolate(i[2], t[2], s));
    if (void 0 !== i[3] && void 0 !== t[3]) {
      return [o, n, e, this.interpolate(i[3], t[3], s)];
    }
    return [o, n, e];
  }
  interpolate(i, t, s) {
    return i + (t - i) * s;
  }
}
class Container extends Obj {
  constructor(t, e) {
    super(
      t,
      (e = {
        margin: 5,
        objects: {},
        ...e,
      })
    ),
      (this.ctx = this.parent["ctx_" + this.options.render_canvas_name]),
      (this.is_visible = !1),
      (this.objects = {});
    for (let t in this.options.objects) {
      let e = {
        ...this.options,
      };
      delete e.objects,
        delete e.height,
        delete e.width,
        (e = {
          ...e,
          ...this.options.objects[t],
          container: this,
          render_id: this.options.render_id + "-" + t,
        }),
        "Button" === e.type && (this.objects[t] = new Button(this.parent, e));
    }
  }
  async render() {
    if (
      null === this.options.x ||
      null === this.options.y ||
      !1 === this.is_visible
    )
      return;
    const t = Object.keys(this.objects).map((t) => this.objects[t].render());
    return Promise.all(t).catch((t) => {
      console.error(t);
    });
  }
  update(t) {
    if ((super.update(t), t.objects)) {
      (this.options.objects = t.objects), (this.objects = {});
      for (let t in this.options.objects) {
        let e = {
          ...this.options,
        };
        delete e.objects,
          delete e.height,
          delete e.width,
          (e = {
            ...e,
            ...this.options.objects[t],
            container: this,
            render_id: this.options.render_id + "-" + t,
          }),
          "Button" === e.type &&
            (this.objects[t]
              ? this.objects[t].update(e)
              : (this.objects[t] = new Button(this.parent, e)));
      }
    }
  }
  place(t, e, s) {
    (s = {
      show: !0,
      render: !0,
      ...s,
    }),
      (this.is_visible = s.show),
      super.place(t, e);
    for (const t in this.objects)
      this.objects[t].place(this.options.x, this.options.y);
    s.render && this.render();
  }
  remove() {
    super.remove();
    const t = Object.keys(this.objects).map((t) => this.objects[t].remove());
    return Promise.all(t).catch((t) => {
      console.error(t);
    });
  }
  async show_obj(t, e) {
    if (this.objects[t]) {
      if (e) for (let s in e) this.objects[t][s].apply(this.objects[t], e[s]);
      this.objects[t].show();
    }
  }
  async hide_obj(t) {
    this.objects[t] && this.objects[t].hide();
  }
  async remove_obj(t) {
    this.objects[t] && this.objects[t].remove();
  }
}
class Tile extends Obj {
  constructor(t) {
    super(t), (this.is_claimed = !1), (this.uuid = !1);
  }
  get_tile_color(t) {
    return this.parent.tile_colors[t]
      ? {
          ...this.parent.tile_colors[t],
        }
      : {
          ...this.parent.ui_colors.busted,
        };
  }
  get_tile_shape(t) {
    return 0 === t ? 0 : 1;
  }
  get_tile_shape_angle(t) {
    return this.parent.shapes[t]
      ? this.parent.shapes[t]
      : this.parent.shapes[1];
  }
  async render(t) {
    try {
      (this.options = {
        n: null,
        x: null,
        y: null,
        o: null,
        h: "",
        s: null,
        c: null,
        t: null,
        ...t,
      }),
        (this.is_selected = !1),
        (this.render_id = this.options.n ? this.options.n : "noid"),
        (this.map_unhover = null),
        (this.found_fit = !1),
        (this.found_fit_id = !1),
        (this.temp_options = {
          c: this.options.c,
          s: this.options.s,
          h: this.options.h,
          x: null,
          y: null,
          o: null,
        });
      const e = this.options.x,
        i = this.options.y;
      if (null === e || null === i) return;
      const s = this.parent.calc.vertices(
        this.parent.side_length,
        this.get_tile_shape_angle(this.options.s),
        [e, i]
      );
      (this.vertices = s.vertices),
        (this.height = s.height),
        (this.width = s.width),
        (this.vertices_tolerance = []),
        0 !== this.options.o &&
          (this.vertices = this.parent.calc.rotate_points(
            [e, i],
            this.vertices,
            this.options.o
          )),
        (this.vertices_shrink = this.parent.calc.shrink_polygon(
          this.vertices,
          this.parent.shrink
        ));
      const o = this.height + 10;
      (this.padding = {
        min_x: this.vertices[0][0] - o,
        max_x: this.vertices[0][0] + o,
        min_y: this.vertices[0][1] - o,
        max_y: this.vertices[0][1] + o,
      }),
        (this.bounding_box = {
          min_x: this.vertices[0][0],
          max_x: this.vertices[0][0],
          min_y: this.vertices[0][1],
          max_y: this.vertices[0][1],
        });
      for (let t = 0; t < this.vertices.length; t++) {
        const [e, i] = this.vertices[t];
        this.vertices_tolerance.push([
          this.parent.point_tolerance *
            Math.round(e / this.parent.point_tolerance),
          this.parent.point_tolerance *
            Math.round(i / this.parent.point_tolerance),
        ]),
          0 !== t &&
            (e - o < this.padding.min_x && (this.padding.min_x = e - o),
            e + o > this.padding.max_x && (this.padding.max_x = e + o),
            i - o < this.padding.min_y && (this.padding.min_y = i - o),
            i + o > this.padding.max_y && (this.padding.max_y = i + o),
            e < this.bounding_box.min_x && (this.bounding_box.min_x = e),
            e > this.bounding_box.max_x && (this.bounding_box.max_x = e),
            i < this.bounding_box.min_y && (this.bounding_box.min_y = i),
            i > this.bounding_box.max_y && (this.bounding_box.max_y = i));
      }
      (this.neighbor_points = {
        0: [],
        1: [],
        2: [],
        3: [],
      }),
        (this.neighbors = {
          1: null,
          2: null,
          3: null,
          4: null,
        }),
        (this.is_visible = !0);
    } catch (t) {
      console.error(t);
    }
  }
  update(t) {
    super.update(t),
      (this.render_id = this.options.n ? this.options.n : "noid");
  }
  remove() {
    (this.is_visible = !1),
      this.parent.delete_render_item(
        void 0,
        void 0,
        "*" + this.render_id + "*"
      ),
      delete this.parent.tiles[this.options.n];
  }
  hide(t, e) {
    (this.is_visible = !1),
      this.parent.update_render_item(
        t || this.options.render_canvas_name,
        e || this.options.render_order_category,
        this.render_id + "*",
        {
          render_enabled: !1,
        }
      );
  }
  async claim(t) {
    try {
      if (!t) return;
      (this.is_claimed = !0),
        (this.uuid = t),
        this.options.n &&
          (this.parent.delete_render_item(
            "zoom",
            "tiles",
            this.options.n + "*"
          ),
          this.parent.delete_render_item("map", "tiles", this.options.n + "*"));
      const e = document.getElementById("info");
      for (let t in this.options) {
        const i = e.querySelector("[name=" + t + "]");
        i &&
          ("INPUT" === i.nodeName && (i.value = this.options[t]),
          "SPAN" === i.nodeName && (i.innerHTML = this.options[t]));
      }
    } catch (t) {
      console.error(t);
    }
  }
  async draw_tile_map(t) {
    if (null === this.options.x || null === this.options.y) return;
    const e = this.get_tile_color(this.options.c),
      i =
        e && e[2] && 1 === e[2]
          ? this.parent.ui_colors.handle_light
          : this.parent.ui_colors.handle_dark;
    if ((t && (await this.pattern_vert_to_map_vert()), 31 === this.options.c)) {
      const t =
        1 === this.options.s
          ? this.parent.images.chickendinnerthiccer
          : this.parent.images.chickendinnerthinner;
      this.parent.draw_image(t, [this.options.x, this.options.y], {
        pattern_to_canvas: !0,
        render_canvas_name: "map",
        render_order_category: "tiles",
        render_id: this.render_id,
        off_screen_id: this.render_id + "-map",
        orientation: this.options.o,
        click: () => {
          this.parent.move_map_target(this.options.x, this.options.y);
        },
      }),
        this.parent.draw_poly(this.map_vertices, {
          pattern_to_canvas: !1,
          fill_color: !1,
          line_width: 2,
          line_color: this.parent.ui_colors.map_bkg,
          render_canvas_name: "map",
          render_order_category: "tiles",
          render_id: this.render_id + "-outline",
          zindex: 10,
        });
    } else
      this.parent.draw_poly(this.map_vertices, {
        pattern_to_canvas: !1,
        fill_color: e[0],
        text_color: i,
        line_width: 2,
        line_color: this.parent.ui_colors.map_bkg,
        font_size: 8,
        render_canvas_name: "map",
        render_order_category: "tiles",
        render_id: this.render_id,
        hover: () => {
          const t = this.get_tile_color(this.options.c);
          this.parent.update_render_item(
            "map",
            "tiles",
            this.render_id,
            {
              fill_color: [t[1]],
            },
            0
          ),
            this.parent.render_queue("map"),
            this.animate_stop("map_unhover"),
            (this.map_unhover = setTimeout(() => {
              this.animate_start("map_unhover", {
                func: (t) => {
                  const e = this.get_tile_color(this.options.c),
                    i = e[1],
                    s = e[0],
                    o = this.interpolate_color(i, s, t);
                  this.parent.update_render_item(
                    "map",
                    "tiles",
                    this.render_id,
                    {
                      fill_color: o,
                    },
                    0
                  ),
                    this.parent.render_queue("map");
                },
              });
            }, 500));
        },
        click: () => {
          this.parent.move_map_target(this.options.x, this.options.y);
        },
      });
  }
  async draw_tile_zoom(t) {
    const e = this.get_tile_color(this.options.c);
    if (
      ((t = {
        reposition: !0,
        color: e && e[0] ? e[0] : [255, 255, 255],
        animate: !1,
        ...t,
      }),
      !1 !== this.parent.is_zoom_side_selected &&
        !0 === this.parent.is_logged_in &&
        !1 === t.animate &&
        this.found_fit &&
        this.found_fit.length > 0 &&
        this.is_claimed)
    ) {
      const t = this.get_tile_color(
        null === this.temp_options.c ? 0 : this.temp_options.c
      );
      this.parent.delete_render_item("zoom", "post_tiles", "temp_fit*");
      for (const e in this.found_fit) {
        const i = +e == +this.found_fit_id;
        this.parent.draw_poly(this.found_fit[e].rotated_vertices, {
          fill_color: t && t[0] ? t[0] : [255, 255, 255],
          fill_alpha: i ? 0.4 : 0.1,
          render_canvas_name: "zoom",
          render_order_category: "post_tiles",
          render_id: "temp_fit-" + e,
          line_width: i ? 3 : 0,
          line_color: t && t[0] ? t[0] : [0, 0, 0],
          z_index: i ? 10 : null,
          click: async () => {
            i ? await this.set_tile() : this.rotate_fit();
          },
        });
      }
    } else
      !0 === this.parent.is_logged_in &&
        this.parent.delete_render_item("zoom", "post_tiles", "temp_fit*");
    if (
      null !== this.options.x &&
      void 0 !== this.options.x &&
      null !== this.options.y &&
      void 0 !== this.options.y
    ) {
      if (
        (t.reposition && (await this.pattern_vert_to_zoom_vert()),
        31 === this.options.c)
      ) {
        const t =
          1 === this.options.s
            ? this.parent.images.chickendinnerthiccer
            : this.parent.images.chickendinnerthinner;
        this.parent.draw_image(t, [this.options.x, this.options.y], {
          pattern_to_canvas: !0,
          render_canvas_name: "zoom",
          render_order_category: "tiles",
          render_id: this.render_id,
          off_screen_id: this.render_id + "-zoom",
          orientation: this.options.o,
          click: () => {},
        }),
          this.parent.draw_poly(this.zoom_vertices, {
            pattern_to_canvas: !1,
            fill_color: !1,
            text: this.options.h ? this.options.h : "",
            text_position: "bottom",
            text_max_length: this.parent.side_length - 10,
            text_color: this.parent.ui_colors.claimed_handle_dark,
            line_color: this.parent.ui_colors.zoom_bkg,
            line_width: 3,
            font_size: 13,
            render_canvas_name: "zoom",
            render_order_category: "tiles",
            render_id: this.render_id + "-outline",
            zindex: 10,
          });
      } else {
        const i =
            e && 1 === e[2]
              ? this.parent.ui_colors.handle_light
              : this.parent.ui_colors.handle_dark,
          s =
            e && 1 === e[2]
              ? this.parent.ui_colors.claimed_handle_light
              : this.parent.ui_colors.claimed_handle_dark;
        this.parent.draw_poly(this.zoom_vertices, {
          pattern_to_canvas: !1,
          fill_color: t.color,
          text: this.options.h ? this.options.h : "",
          text_position: "bottom",
          text_max_length: this.parent.side_length - 10,
          text_color: this.is_claimed ? s : i,
          line_color: this.parent.ui_colors.zoom_bkg,
          line_width: 3,
          font_size: 13,
          render_canvas_name: "zoom",
          render_order_category: "tiles",
          render_id: this.render_id,
          click: () => {},
        });
      }
      this.parent.is_logged_in &&
        this.parent.delete_render_item(
          "zoom",
          "post_tiles",
          this.render_id + "_side_*"
        );
    }
  }
  async draw_tile_zoom_open_points() {
    try {
      if (!1 === this.is_claimed && !0 === this.parent.is_logged_in) {
        const t = [...this.zoom_vertices, this.zoom_vertices[0]];
        for (let e = 1; e < t.length; e++)
          if (null === this.neighbors[e]) {
            let i = !1;
            for (let s of this.parent.zoom_ns) {
              const o = this.parent.tiles[s];
              if (o.options.n === this.options.n) continue;
              let n = !1;
              for (let t in this.neighbors)
                o.options.n === this.neighbors[t] && (n = !0);
              if (n) continue;
              const r = o.zoom_vertices_shrink;
              if (this.parent.calc.overlap(r, [t[e - 1], t[e]])) {
                i = !0;
                break;
              }
            }
            if (i) continue;
            let s = [...this.parent.ui_colors.open_side],
              o = this.parent.images.clickable;
            this.parent.is_zoom_side_selected &&
              this.parent.is_zoom_side_selected.n === this.options.n &&
              this.parent.is_zoom_side_selected.side === e &&
              (s = [...this.parent.ui_colors.open_side_selected]),
              this.parent.is_zoom_side_selected &&
                (o = this.parent.images.clicked);
            const n = this.parent.calc.midpoint(
              t[e - 1][0],
              t[e - 1][1],
              t[e][0],
              t[e][1]
            );
            await this.parent.draw_point(n, {
              pattern_to_canvas: !1,
              point_color: this.parent.debug
                ? "string" == typeof s
                  ? s
                  : this.parent.rgb_to_str(s)
                : "rgba(0,0,0,0)",
              render_canvas_name: "zoom",
              render_order_category: "post_tiles",
              render_id: this.render_id + "_side_" + e,
              point_size: 2,
            }),
              await this.parent.draw_image(o, n, {
                pattern_to_canvas: !1,
                render_canvas_name: "zoom",
                render_order_category: "pre_tiles",
                render_id: this.render_id + "_side_" + e,
                off_screen_id: this.parent.is_zoom_side_selected
                  ? "clicked"
                  : "clickable",
              });
          }
      }
    } catch (t) {
      console.error(t);
    }
  }
  async draw_zoom_visible(t, e, i) {
    return (
      (i = !1 !== i),
      new Promise(async (s) => {
        null === this.options.x || null === this.options.y
          ? !0 === this.is_claimed
            ? (this.last_ghost_neighbor &&
                i &&
                (await this.ghost_move(void 0, !1)),
              await this.draw_tile_zoom(),
              s(this))
            : (this.hide("zoom", "tiles"), s(!1))
          : await this.check_obj_visible_inside_rect(
              t,
              e,
              (this.parent.zoom.can_w + 200) / this.parent.zoom_zoom,
              (this.parent.zoom.can_h + 200) / this.parent.zoom_zoom
            ).then(async (t) => {
              t
                ? (!0 === this.is_claimed &&
                    this.last_ghost_neighbor &&
                    i &&
                    (await this.ghost_move(void 0, !1)),
                  await this.draw_tile_zoom(),
                  s(this))
                : (this.hide("zoom", "tiles"), s(!1));
            });
      })
    );
  }
  async pattern_vert_to_map_vert() {
    const t = this.vertices.map((t) =>
      this.parent.calc.async_pattern_to_map_canvas_xy(t[0], t[1])
    );
    this.map_vertices = await Promise.all(t);
  }
  async pattern_vert_to_zoom_vert() {
    this.zoom_centroid = this.parent.calc.pattern_to_zoom_canvas_xy(
      this.options.x,
      this.options.y
    );
    const t = this.vertices.map((t) =>
      this.parent.calc.async_pattern_to_zoom_canvas_xy(t[0], t[1])
    );
    this.zoom_vertices = await Promise.all(t);
    const e = this.vertices_shrink.map((t) =>
      this.parent.calc.async_pattern_to_zoom_canvas_xy(t[0], t[1])
    );
    (this.zoom_vertices_shrink = await Promise.all(e)),
      (this.zoom_bounding_box = {}),
      (this.side_vertices = {
        1: [],
        2: [],
        3: [],
        4: [],
      });
    for (let t = 0; t < this.zoom_vertices.length; t++) {
      const [e, i] = this.zoom_vertices[t];
      this.side_vertices[t + 1].push(this.zoom_vertices[t]),
        0 === t
          ? (this.side_vertices[4].push(this.zoom_vertices[t]),
            (this.zoom_bounding_box = {
              min_x: e,
              max_x: e,
              min_y: i,
              max_y: i,
            }))
          : (this.side_vertices[t].push(this.zoom_vertices[t]),
            e < this.zoom_bounding_box.min_x &&
              (this.zoom_bounding_box.min_x = e),
            e > this.zoom_bounding_box.max_x &&
              (this.zoom_bounding_box.max_x = e),
            i < this.zoom_bounding_box.min_y &&
              (this.zoom_bounding_box.min_y = i),
            i > this.zoom_bounding_box.max_y &&
              (this.zoom_bounding_box.max_y = i));
    }
    const i = (this.zoom_vertices[0][0] + this.zoom_vertices[2][0]) / 2,
      s = (this.zoom_vertices[0][1] + this.zoom_vertices[2][1]) / 2;
    this.side_vertices[1].push([i, s]),
      this.side_vertices[2].push([i, s]),
      this.side_vertices[3].push([i, s]),
      this.side_vertices[4].push([i, s]);
  }
  async add_neighbors(t, e, i, s) {
    if (t === this.options.n) return;
    for (let o = 0; o < this.vertices_tolerance.length; o++) {
      const [n, r] = this.vertices_tolerance[o];
      e === n &&
        i === r &&
        (this.neighbor_points[o].includes(t) || this.neighbor_points[o].push(t),
        s &&
          this.parent.tiles[t] &&
          this.parent.tiles[t].add_neighbors(this.options.n, e, i, !1));
    }
    let o = {};
    for (let t = 0; t < 4; t++) {
      const e = this.neighbor_points[t];
      for (let i = 0; i < e.length; i++) {
        const s = e[i];
        (o[s] = o[s] ? o[s] : []), o[s].push(t);
        const n = this.side_number_by_point_numbers(o[s]);
        !1 !== n && (this.neighbors[n] = s);
      }
    }
  }
  point_number(t) {
    const e = this.parent.point_tolerance,
      i = e * Math.round(t[0] / e),
      s = e * Math.round(t[1] / e);
    for (let t = 0; t < this.vertices_tolerance.length; t++) {
      const [e, o] = this.vertices_tolerance[t];
      if (e === i && o === s) return t;
    }
    return !1;
  }
  side_number(t, e) {
    const i = this.parent.point_tolerance,
      s = i * Math.round(t[0] / i),
      o = i * Math.round(t[1] / i),
      n = i * Math.round(e[0] / i),
      r = i * Math.round(e[1] / i);
    let _ = [];
    for (let t = 0; t < this.vertices_tolerance.length; t++) {
      const [e, i] = this.vertices_tolerance[t];
      ((e === s && i === o) || (e === n && i === r)) && _.push(t);
    }
    return this.side_number_by_point_numbers(_);
  }
  side_number_by_point_numbers(t) {
    return (
      2 === t.length &&
      (t.sort(),
      0 === t[0] && 1 === t[1]
        ? 1
        : 1 === t[0] && 2 === t[1]
        ? 2
        : 2 === t[0] && 3 === t[1]
        ? 3
        : 0 === t[0] && 3 === t[1] && 4)
    );
  }
  async ghost_move(t, e) {
    try {
      this.parent.debug && console.log("ghost_move redraw:", e, t),
        (e = void 0 === e),
        t ? (this.last_ghost_neighbor = t) : (t = this.last_ghost_neighbor);
      const i = this.parent.is_zoom_side_selected;
      if (!1 === i) return;
      let s = [];
      switch (i.side) {
        case 1:
          s = [t.vertices[0], t.vertices[1]];
          break;
        case 2:
          s = [t.vertices[1], t.vertices[2]];
          break;
        case 3:
          s = [t.vertices[2], t.vertices[3]];
          break;
        case 4:
          s = [t.vertices[3], t.vertices[0]];
          break;
        default:
          break;
      }
      if (2 !== s.length) return !1;
      await this.parent.delete_render_item("zoom", "pre_tiles", "temp_vert*");
      const o = [1, 2, 3, 4].map((t) => this.test_tile_fit(s, t));
      (this.found_fit = await Promise.all(o)
        .then((t) => t.filter((t) => !1 !== t))
        .catch((t) => console.error(t))),
        (this.found_fit_id = this.found_fit.length > 0 && 0),
        e && (await this.parent.draw_zoom_canvas());
    } catch (t) {
      console.error(t);
    }
  }
  async test_tile_fit(t, e) {
    try {
      e = e || 1;
      let i = [[...t[1]], [...t[0]]];
      (3 !== e && 4 !== e) || (i = [[...t[0]], [...t[1]]]);
      let s = this.parent.calc.vertices(
        this.parent.side_length,
        this.get_tile_shape_angle(this.temp_options.s),
        i[0]
      );
      const o = s.vertices[0][0] - i[0][0],
        n = s.vertices[0][1] - i[0][1];
      s.translated_vertices = s.vertices.map((t) => [t[0] - o, t[1] - n]);
      let r = 0,
        _ = e % 2 == 0 ? 1 : 3;
      for (let t = 0; t < s.translated_vertices.length; t++) {
        const [o, n] = s.translated_vertices[t];
        if (i[0][0] === o && i[0][1] === n) {
          (r = t),
            (_ = e % 2 == 0 ? (0 === t ? 3 : t - 1) : 3 === t ? 0 : t + 1);
          break;
        }
      }
      const a = s.translated_vertices[_],
        h = this.parent.calc.angle_between_pts_with_center(i[0], a, i[1]),
        l = this.parent.calc.rotate_polygon(s.translated_vertices, r, h),
        d = this.parent.calc.shrink_polygon(l, this.parent.shrink),
        c = this.parent.point_tolerance;
      let p = [],
        m = !1;
      for (let t = 0; t < this.parent.zoom_ns.length; t++) {
        const e = this.parent.zoom_ns[t];
        if (e === this.options.n) continue;
        const o = this.parent.tiles[e];
        if (!o) continue;
        const n = this.parent.calc.distance(
            i[0][0],
            i[0][1],
            o.options.x,
            o.options.y
          ),
          r = this.parent.calc.distance(
            i[1][0],
            i[1][1],
            o.options.x,
            o.options.y
          );
        if (
          n > s.width + c &&
          r > s.width + c &&
          n > s.height + c &&
          r > s.height + c
        ) {
          p.push(
            (o.options.h ? o.options.h : o.options.n) +
              " too far away from " +
              (this.options.h ? this.options.h : this.options.n) +
              " to overlap"
          );
          continue;
        }
        if (this.parent.calc.share_side(l, o.vertices) > 1) {
          (m = !0),
            p.push(
              (o.options.h ? o.options.h : o.options.n) +
                " shares to many sides/overlaps with " +
                (this.options.h ? this.options.h : this.options.n)
            );
          continue;
        }
        if (this.parent.calc.overlap(d, o.vertices_shrink)) {
          (m = !0),
            p.push(
              (o.options.h ? o.options.h : o.options.n) +
                " overlaps with " +
                (this.options.h ? this.options.h : this.options.n)
            );
          break;
        }
      }
      const u = [...this.parent.ui_colors.light_bkg, 0.3];
      let v = [...this.parent.ui_colors.light_bkg];
      return (
        await this.parent.draw_lines([...s.vertices, s.vertices[0]], {
          line_color: u,
          render_canvas_name: "zoom",
          render_order_category: "pre_tiles",
          render_id: "temp_vert-" + e,
        }),
        await this.parent.draw_xy_point(s.vertices[0], {
          point_color: u,
          text: "vert0",
          render_canvas_name: "zoom",
          render_order_category: "pre_tiles",
          render_id: "temp_vert_point_0-" + e,
        }),
        await this.parent.draw_poly(s.translated_vertices, {
          fill_color: !1,
          line_color: u,
          line_width: 1,
          render_canvas_name: "zoom",
          render_order_category: "pre_tiles",
          render_id: "temp_vert_translated-" + e,
        }),
        await this.parent.draw_xy_point(s.translated_vertices[r], {
          point_color: u,
          text: "rot" + r,
          render_canvas_name: "zoom",
          render_order_category: "pre_tiles",
          render_id: "temp_vert_translated_center_rotate_point-" + e,
        }),
        await this.parent.draw_arc(i[0], a, i[1], {
          line_color: u,
          render_canvas_name: "zoom",
          render_order_category: "pre_tiles",
          render_id: "temp_vert_rotation_arc-" + e,
        }),
        await this.parent.draw_xy_point(a, {
          point_color: u,
          text: "rot",
          render_canvas_name: "zoom",
          render_order_category: "pre_tiles",
          render_id: "temp_vert_rotated_point-" + e,
        }),
        await this.parent.draw_poly(l, {
          fill_color: !1,
          label_points: !0,
          point_color: m ? u : v,
          line_color: m ? u : v,
          line_width: m ? 1 : 3,
          render_canvas_name: "zoom",
          render_order_category: "pre_tiles",
          render_id: "temp_vert_rotated-" + e,
        }),
        this.parent.debug &&
          (await this.parent.draw_poly(d, {
            fill_color: !1,
            line_color: m ? "red" : "green",
            line_width: 1,
            render_canvas_name: "zoom",
            render_order_category: "post_tiles",
            render_id: "temp_vert_rotated-" + e,
            text: e,
            text_color: "white",
          })),
        m
          ? (this.parent.debug && console.log("test_fit", e, "found false", p),
            this.parent.delete_render_item(
              "zoom",
              "pre_tiles",
              "temp_vert-" + e
            ),
            this.parent.delete_render_item(
              "zoom",
              "pre_tiles",
              "temp_vert_point_0-" + e
            ),
            this.parent.delete_render_item(
              "zoom",
              "pre_tiles",
              "temp_vert_translated-" + e
            ),
            this.parent.delete_render_item(
              "zoom",
              "pre_tiles",
              "temp_vert_translated_center_rotate_point-" + e
            ),
            this.parent.delete_render_item(
              "zoom",
              "pre_tiles",
              "temp_vert_rotation_arc-" + e
            ),
            this.parent.delete_render_item(
              "zoom",
              "pre_tiles",
              "temp_vert_rotated_point-" + e
            ),
            this.parent.delete_render_item(
              "zoom",
              "pre_tiles",
              "temp_vert_rotated-" + e
            ),
            !1)
          : (this.parent.debug && console.log("test_fit", e, "found true", p),
            {
              vertices: s.translated_vertices,
              rotated_vertices: l,
              bounding_box: this.parent.calc.bounding_box(l),
              o: h,
              x: (l[0][0] + l[2][0]) / 2,
              y: (l[0][1] + l[2][1]) / 2,
            })
      );
    } catch (t) {
      console.error(t);
    }
  }
  rotate_fit() {
    this.found_fit &&
      this.found_fit.length > 1 &&
      ((this.found_fit_id = this.found_fit[this.found_fit_id + 1]
        ? this.found_fit_id + 1
        : 0),
      this.parent.draw_zoom_canvas(!1),
      this.parent.render_queue("zoom"));
  }
  async set_tile(t) {
    try {
      if (!0 !== this.is_claimed) return;
      const e = document.getElementById("h");
      let i = {
        ...this.temp_options,
      };
      if (
        (e && e.value !== this.options.h && (i.h = e.value),
        void 0 !== this.found_fit_id &&
          null !== this.found_fit_id &&
          this.found_fit[this.found_fit_id])
      ) {
        const t = this.found_fit[this.found_fit_id];
        (i.x = t.x), (i.y = t.y), (i.o = t.o);
      }
      t &&
        (i = {
          ...i,
          ...t,
        }),
        (null !== this.options.c && void 0 !== this.options.c) ||
          (null !== i.c && void 0 !== i.c) ||
          (i.c = 0),
        (null !== this.options.s && void 0 !== this.options.s) ||
          (null !== i.s && void 0 !== i.s) ||
          (i.s = 1);
      for (let t in i) null === i[t] && delete i[t];
      if (0 === Object.keys(i).length) return;
      await this.parent.update_tile(i),
        (this.found_fit = !1),
        (this.found_fit_id = !1),
        (this.last_ghost_neighbor = !1),
        (this.parent.zoom_target = [i.x, i.y]),
        await this.parent.delete_render_item("zoom", "post_tiles", "temp_fit*"),
        await this.parent.delete_render_item("zoom", "pre_tiles", "temp_vert*"),
        await this.parent.load({
          resize: !0,
          features: !0,
          reset_data: !0,
          draw_target: !1,
          buttons: !0,
          add_events: !1,
          render: !0,
        });
    } catch (t) {
      return console.error("Error while saving tile data:", t.message), null;
    }
  }
  async set_color(t) {
    try {
      this.temp_options.c = +t;
      const e = this.get_tile_color(+t);
      if (
        this.parent.is_zoom_side_selected &&
        this.parent.tiles[this.parent.is_zoom_side_selected.n]
      )
        this.parent.update_render_item("zoom", "post_tiles", "temp_fit*", {
          fill_color: e[0],
          line_color: e[1],
        });
      else if (
        null !== this.options.x &&
        void 0 !== this.options.x &&
        null !== this.options.y &&
        void 0 !== this.options.y
      ) {
        const i =
          e && 1 === e[2]
            ? this.parent.ui_colors.claimed_handle_light
            : this.parent.ui_colors.claimed_handle_dark;
        this.parent.update_render_item("zoom", "tiles", this.render_id, {
          fill_color: e[0],
          text_color: i,
        }),
          await this.parent.update_tile({
            c: +t,
          });
      }
    } catch (t) {
      console.error(t);
    }
  }
  async set_shape(t) {
    try {
      if (t === this.temp_options.s) return;
      this.parent.is_zoom_side_selected &&
      this.parent.tiles[this.parent.is_zoom_side_selected.n]
        ? ((this.temp_options.s = t),
          (this.found_fit = !1),
          (this.found_fit_id = !1),
          await this.ghost_move(void 0, !1),
          await this.draw_tile_zoom())
        : new Msg("Select a new tile placement to pick a different shape!");
    } catch (t) {
      console.error(t);
    }
  }
  async set_info_form(t) {
    const e = document.getElementById("info");
    for (let i in t) {
      const s = e.querySelector("[name=" + i + "]");
      s && "INPUT" === s.nodeName && (s.value = t[i]);
    }
  }
}
class Button extends Obj {
  constructor(t, e) {
    super(
      t,
      (e = {
        container: null,
        margin: 5,
        text: "Button",
        is_selected: !1,
        button_style: {
          text_color: "white",
          font_size: 15,
          fill_color: [100, 100, 100],
          line_width: 1,
          line_color: "#CCC",
          ...e.button_style,
        },
        button_hover_style: {
          fill_color: [150, 150, 150],
          line_color: "#FFF",
          ...e.button_style,
          ...e.button_hover_style,
        },
        button_click_style: {
          fill_color: [150, 150, 150],
          line_color: "#FFF",
          ...e.button_style,
          ...e.button_click_style,
        },
        button_selected_style: {
          fill_color: [150, 150, 150],
          line_color: "#FFF",
          ...e.button_style,
          ...e.button_selected_style,
        },
        click: null,
        hover: null,
        ...e,
      })
    ),
      null === this.options.click &&
        (this.options.click = () => {
          this.on_click();
        }),
      null === this.options.hover &&
        (this.options.hover = () => {
          this.on_hover();
        }),
      (this.ctx = this.parent["ctx_" + this.options.render_canvas_name]),
      (this.is_visible = this.options.render_enabled),
      (this.is_selected = this.options.is_selected),
      this.options.width ||
        (this.options.width = 7.5 * this.options.text.length + 20),
      this.options.height ||
        (this.options.height = this.options.font_size + 20);
  }
  async render() {
    if (
      null === this.options.x ||
      null === this.options.y ||
      !1 === this.is_visible
    )
      return;
    let t = {
      pattern_to_canvas: this.options.pattern_to_canvas,
      text: this.options.text,
      render_canvas_name: this.options.render_canvas_name,
      render_order_category: this.options.render_order_category,
      render_id: this.options.render_id,
      render_enabled: this.is_visible,
      z_index: this.options.z_index,
      hover: this.options.hover,
      click: this.options.click,
      ...this.options.button_style,
    };
    !0 === this.is_selected &&
      (t = {
        ...t,
        ...this.options.button_selected_style,
      }),
      "polygon" === this.options.shape
        ? this.parent.draw_poly(this.vertices, t)
        : this.parent.draw_rect(
            this.bounding_box.min_x,
            this.bounding_box.min_y,
            this.options.width,
            this.options.height,
            t
          );
  }
  on_hover() {
    this.parent.update_render_item(
      this.options.render_canvas_name,
      this.options.render_order_category,
      this.options.render_id,
      this.options.button_hover_style,
      0
    ),
      this.parent.render_queue(this.options.render_canvas_name),
      this.animate_stop(this.options.render_id + "_unhover"),
      (this[this.options.render_id + "_unhover"] = setTimeout(() => {
        this.animate_start(this.options.render_id + "_unhover", {
          func: (t) => {
            const e = this.options.button_hover_style.fill_alpha,
              i = this.options.button_style.fill_alpha,
              o = this.interpolate(e, i, t);
            this.parent.update_render_item(
              this.options.render_canvas_name,
              this.options.render_order_category,
              this.options.render_id,
              {
                fill_alpha: o,
              },
              0
            ),
              this.parent.render_queue(this.options.render_canvas_name);
          },
        });
      }, 500));
  }
  on_click() {}
}
class Penrose {
  constructor(t, e, o, a) {
    (this.parent = t),
      (this.debug = !0 === a),
      (this.canvas_map = document.getElementById("canvas_map")),
      (this.ctx_map = this.canvas_map.getContext("2d")),
      (this.canvas_zoom = document.getElementById("canvas_zoom")),
      (this.ctx_zoom = this.canvas_zoom.getContext("2d")),
      (this.data = e),
      (this.images = o),
      (this.calc = new Calcs(this)),
      (this.my_tile = !1),
      (this.logged_in = !1),
      (this.display_mode = "stacked"),
      (this.point_tolerance = 10),
      (this.shrink = 10),
      (this.zoom_zoom = 1),
      (this.side_length = 100),
      (this.shapes = {
        0: 36,
        1: 72,
      }),
      (this.tile_colors = [
        [[73, 72, 158], [78, 206, 190], 1],
        [[210, 34, 55], [255, 134, 68], 1],
        [[255, 72, 114], [255, 139, 166], 1],
        [[255, 138, 0], [255, 193, 86], 0],
        [[254, 221, 18], [255, 243, 169], 0],
        [[85, 155, 31], [135, 245, 51], 1],
        [[49, 106, 175], [112, 177, 255], 1],
        [[111, 36, 118], [193, 42, 207], 1],
        [[112, 113, 107], [209, 209, 209], 1],
        [[72, 74, 89], [144, 147, 169], 1],
        [[127, 115, 39], [210, 187, 44], 1],
        [[0, 0, 0], [97, 97, 97], 1],
        [[255, 255, 255], [160, 176, 236], 0],
        [[0, 255, 0], [255, 0, 255], 0],
        [[255, 0, 0], [0, 255, 255], 1],
        [[0, 0, 255], [255, 255, 0], 1],
        [[255, 0, 255], [0, 255, 0], 0],
        [[0, 255, 255], [255, 0, 0], 0],
        [[255, 255, 0], [0, 0, 255], 0],
        [[0, 50, 0], [50, 0, 50], 1],
        [[50, 0, 0], [0, 50, 50], 1],
        [[0, 0, 50], [50, 50, 0], 1],
        [[50, 0, 50], [0, 50, 0], 1],
        [[0, 50, 50], [50, 0, 0], 1],
        [[50, 50, 0], [0, 0, 50], 1],
        [[150, 255, 150], [255, 150, 255], 0],
        [[255, 150, 150], [150, 255, 255], 0],
        [[150, 150, 255], [255, 255, 150], 0],
        [[255, 150, 255], [150, 255, 150], 0],
        [[150, 255, 255], [255, 150, 150], 0],
        [[255, 255, 150], [150, 150, 255], 0],
      ]),
      (this.ui_colors = {
        open_side: [0, 200, 200],
        open_side_hover: [255, 255, 255],
        open_side_selected: [255, 255, 0],
        handle_light: [255, 255, 255, 0.5],
        claimed_handle_light: [255, 255, 255, 1],
        handle_dark: [0, 0, 0, 0.5],
        claimed_handle_dark: [0, 0, 0, 1],
        highlight: [110, 248, 214],
        light_bkg: [107, 112, 164],
        zoom_bkg: [6, 24, 53],
        map_bkg: [0, 0, 0],
        busted: [[255, 0, 144], [144, 0, 255], 1],
      }),
      (this.star_img_perc = {
        0: {
          p: 0.5,
          d: 1,
        },
        1: {
          p: 0.2,
          d: 4,
        },
        2: {
          p: 0.1,
          d: 10,
        },
        3: {
          p: 0.1,
          d: 16,
        },
        4: {
          p: 0.1,
          d: 29,
        },
        5: {
          p: 0,
          d: 42,
        },
      }),
      (this.draw_options = {
        z_index: null,
        pattern_to_canvas: !0,
        render_canvas_name: "map",
        render_order_category: null,
        render_id: null,
        render_enabled: !0,
        orientation: 0,
        off_screen_id: null,
        label_points: !1,
        point_color: null,
        point_alpha: null,
        point_size: 3,
        fill_color: "rgba(255,255,255,.5)",
        fill_alpha: null,
        line_width: 1,
        line_color: "rgba(255,255,255,.5)",
        line_alpha: null,
        text: "",
        text_color: "white",
        text_alpha: null,
        font_size: 12,
        text_position: "center",
        text_orientation: 0,
        text_max_length: null,
        text_x: null,
        text_y: null,
        hover: !1,
        click: !1,
        animate: !1,
      }),
      (this.tiles = {}),
      (this.zoom_target = [0, 0]),
      (this.is_zoom_side_selected = !1),
      (this.queue_order = [
        "background",
        "pre_tiles",
        "cache",
        "tiles",
        "post_tiles",
        "buttons",
        "foreground",
      ]),
      (this.queue = {
        zoom: {
          background: {},
          pre_tiles: {},
          cache: {},
          tiles: {},
          post_tiles: {},
          buttons: {},
          foreground: {},
        },
        map: {
          background: {},
          pre_tiles: {},
          cache: {},
          tiles: {},
          post_tiles: {},
          buttons: {},
          foreground: {},
        },
      }),
      (this.pool = {
        zoom: {
          background: {},
          pre_tiles: {},
          cache: {},
          tiles: {},
          post_tiles: {},
          buttons: {},
          foreground: {},
        },
        map: {
          background: {},
          pre_tiles: {},
          cache: {},
          tiles: {},
          post_tiles: {},
          buttons: {},
          foreground: {},
        },
      }),
      (this.off_screen_canvases = {});
  }
  force_throb_reload(t) {
    document.getElementById("content").classList.add("forever_loading"),
      setTimeout(() => {
        location.reload();
      }, t);
  }
  throb() {
    document.getElementById("content").classList.add("loading");
  }
  unthrob() {
    document.getElementById("content").classList.remove("loading");
  }
  async init() {
    try {
      return (
        console.log("Kick-starting the tile grid reactor..."),
        this.load({
          resize: !0,
          features: !0,
          reset_data: !0,
          draw_target: !0,
          buttons: !1,
          add_events: !0,
          render: !0,
        })
      );
    } catch (t) {
      console.error(t);
    }
  }
  async add_events() {
    (this.is_window_resizing = !1),
      (this.resize_stop_timer = null),
      this.window_resize_event_listener_added ||
        (window.removeEventListener("resize", this.handle_window_resize),
        window.addEventListener("resize", this.handle_window_resize)),
      this.window_focus_event_listener_added ||
        (window.removeEventListener("focus", this.handle_window_focus),
        window.addEventListener("focus", this.handle_window_focus)),
      (this.map_can_xy = document.getElementById("map_can_xy")),
      (this.map_pat_xy = document.getElementById("map_pat_xy")),
      (this.map_is_mouse_moving = !1),
      (this.map_mouse_stop_timer = null),
      this.map_mousemove_event_listener_added ||
        (this.canvas_map.removeEventListener(
          "click",
          this.handle_map_mousemove
        ),
        this.canvas_map.addEventListener("click", this.handle_map_mousemove)),
      this.map_click_event_listener_added ||
        (this.canvas_map.removeEventListener("click", this.handle_map_click),
        this.canvas_map.addEventListener("click", this.handle_map_click));
  }
  handle_window_focus = async (t) => (
    (this.window_focus_event_listener_added = !0),
    this.load({
      resize: !0,
      features: !0,
      reset_data: !0,
      draw_target: !0,
      buttons: !1,
      add_events: !0,
      render: !0,
    })
  );
  handle_window_resize = (t) => {
    (this.window_resize_event_listener_added = !0),
      this.throb(),
      !1 === this.is_window_resizing &&
        (this.ctx_zoom.clearRect(
          0,
          0,
          this.canvas_zoom.width,
          this.canvas_zoom.height
        ),
        this.ctx_map.clearRect(
          0,
          0,
          this.canvas_map.width,
          this.canvas_map.height
        )),
      clearTimeout(this.resize_stop_timer),
      (this.is_window_resizing = !0),
      (this.resize_stop_timer = setTimeout(async () => {
        (this.is_window_resizing = !1),
          await this.load({
            resize: !0,
            features: !0,
            reset_data: !0,
            draw_target: !0,
            buttons: !0,
            add_events: !0,
            render: !0,
          });
      }, 300));
  };
  handle_map_mousemove = (t) => {
    this.map_mousemove_event_listener_added = !0;
    const { offsetX: e, offsetY: o } = t,
      [a, n] = this.calc.map_canvas_to_pattern_xy(e, o, !0);
    clearTimeout(this.map_mouse_stop_timer),
      (this.map_is_mouse_moving = !0),
      this.debug &&
        ((this.map_can_xy.innerHTML = `(${e},${o})`),
        (this.map_pat_xy.innerHTML = `(${a},${n})`)),
      (this.map_mouse_stop_timer = setTimeout(async () => {
        (this.map_is_mouse_moving = !1),
          this.action_queue("hover", "map", e, o);
      }, 100));
  };
  handle_map_click = async (t) => {
    this.map_click_event_listener_added = !0;
    const { offsetX: e, offsetY: o } = t;
    if (!(await this.action_queue("click", "map", e, o))) {
      const [t, a] = this.calc.map_canvas_to_pattern_xy(e, o, !0);
      this.move_map_target(t, a);
    }
  };
  async zoom_events() {
    (this.zoom_can_xy = document.getElementById("zoom_can_xy")),
      (this.zoom_pat_xy = document.getElementById("zoom_pat_xy")),
      (this.zoom_is_mouse_moving = !1),
      (this.zoom_mouse_stop_timer = null),
      this.zoom_mousemove_event_listener_added ||
        (this.canvas_zoom.removeEventListener(
          "mousemove",
          this.handle_zoom_mousemove
        ),
        this.canvas_zoom.addEventListener(
          "mousemove",
          this.handle_zoom_mousemove
        )),
      this.zoom_click_event_listener_added ||
        (this.canvas_zoom.removeEventListener("click", this.handle_zoom_click),
        this.canvas_zoom.addEventListener("click", this.handle_zoom_click));
  }
  handle_zoom_mousemove = (t) => {
    this.zoom_mousemove_event_listener_added = !0;
    const { offsetX: e, offsetY: o } = t,
      [a, n] = this.calc.zoom_canvas_to_pattern_xy(e, o, !0);
    clearTimeout(this.zoom_mouse_stop_timer),
      (this.zoom_is_mouse_moving = !0),
      this.debug &&
        ((this.zoom_can_xy.innerHTML = `(${e},${o})`),
        (this.zoom_pat_xy.innerHTML = `(${a},${n})`)),
      (this.zoom_mouse_stop_timer = setTimeout(async () => {
        (this.zoom_is_mouse_moving = !1),
          this.action_queue("hover", "zoom", e, o);
      }, 100));
  };
  handle_zoom_click = async (t) => {
    if (((this.zoom_click_event_listener_added = !0), !1 !== this.my_tile)) {
      const { offsetX: e, offsetY: o } = t,
        a = await this.action_queue("click", "zoom", e, o);
      if (
        (this.debug &&
          console.log({
            clicked_item: a,
          }),
        !a)
      ) {
        const t = {};
        for (let e in this.queue.zoom.post_tiles)
          this.queue.zoom.post_tiles[e] &&
            e.match(/_side_\d$/) &&
            ((t[e] = this.queue.zoom.post_tiles[e].render[0].args),
            this.update_render_item("zoom", "post_tiles", e, {
              point_color: this.debug
                ? [...this.ui_colors.open_side]
                : [0, 0, 0, 0],
              text_color: [...this.ui_colors.open_side],
            }));
        const a = await this.calc.closest_point(e, o, t, 200);
        if (
          (this.debug &&
            console.log({
              closest_side: a,
            }),
          a)
        ) {
          const t = a.split("_");
          this.tiles[t[0]] &&
            ((this.is_zoom_side_selected = {
              n: t[0],
              side: +t[2],
            }),
            await this.my_tile.ghost_move(this.tiles[t[0]], !1),
            await this.my_tile.draw_tile_zoom());
        } else
          (this.is_zoom_side_selected = !1),
            (this.my_tile.found_fit = !1),
            (this.my_tile.found_fit_id = !1),
            (this.my_tile.last_ghost_neighbor = !1),
            await this.delete_render_item("zoom", "pre_tiles", "temp_vert*"),
            await this.delete_render_item("zoom", "tiles", "temp_fit*"),
            await this.delete_render_item("zoom", "post_tiles", "temp_fit*"),
            await this.draw_zoom_canvas();
        this.render_queue("zoom");
      }
    } else {
      const t = document.getElementById("login"),
        e = t.querySelectorAll(".uuid");
      e[0].focus(),
        t.classList.add("flash-animation"),
        setTimeout(() => {
          t.classList.remove("flash-animation");
        }, 500);
      new Msg("Enter the UUID found on the insert in your badge pack.", {
        type: "message",
        title: "Hey!",
        on_close: () => {
          e[0].focus();
        },
      });
    }
  };
  resize_canvases() {
    const t = document.getElementById("header"),
      e = document.getElementById("container"),
      o = window.innerWidth - 45,
      a = window.innerHeight - 45 - t.clientHeight;
    window.innerWidth > window.innerHeight
      ? (e.classList.add("wide"),
        (this.display_mode = "row"),
        (this.canvas_zoom.width = o / 2),
        (this.canvas_zoom.height = a),
        (this.canvas_map.width = o / 2),
        (this.canvas_map.height = a))
      : (e.classList.remove("wide"),
        (this.display_mode = "stacked"),
        (this.canvas_zoom.width = o),
        (this.canvas_zoom.height = a / 2),
        (this.canvas_map.width = o - 10),
        (this.canvas_map.height = a / 2));
  }
  async clip_corners() {
    await this.delete_render_item("map", "foreground", "corner*"),
      await this.delete_render_item("zoom", "foreground", "corner*");
    const t = [255, 255, 255, 0.3],
      e = this.canvas_zoom.width,
      o = this.canvas_zoom.height,
      a = this.canvas_map.width,
      n = this.canvas_map.height;
    this.draw_poly(
      [
        [0, 0],
        [0, 59],
        [45, 0],
      ],
      {
        pattern_to_canvas: !1,
        render_canvas_name: "zoom",
        render_order_category: "foreground",
        render_id: "corner-top-left",
        fill_color: this.ui_colors.light_bkg,
      },
      0
    ),
      this.draw_poly(
        [
          [2, 4],
          [36, 4],
          [30, 13],
          [2, 13],
        ],
        {
          pattern_to_canvas: !1,
          render_canvas_name: "zoom",
          render_order_category: "foreground",
          render_id: "corner-top-left",
          fill_color: t,
        },
        1
      ),
      this.draw_poly(
        [
          [2, 18],
          [26, 18],
          [20, 27],
          [2, 27],
        ],
        {
          pattern_to_canvas: !1,
          render_canvas_name: "zoom",
          render_order_category: "foreground",
          render_id: "corner-top-left",
          fill_color: t,
        },
        2
      ),
      this.draw_poly(
        [
          [2, 32],
          [16, 32],
          [10, 41],
          [2, 41],
        ],
        {
          pattern_to_canvas: !1,
          render_canvas_name: "zoom",
          render_order_category: "foreground",
          render_id: "corner-top-left",
          fill_color: t,
        },
        3
      ),
      this.draw_poly(
        [
          [e - 30, 0],
          [e, 0],
          [e, 84],
        ],
        {
          pattern_to_canvas: !1,
          render_canvas_name: "zoom",
          render_order_category: "foreground",
          render_id: "corner-top-right",
          fill_color: this.ui_colors.light_bkg,
        },
        0
      ),
      this.draw_image(
        this.images.logo,
        [
          a - this.images.logo.width / 2 - 20,
          n - this.images.logo.height / 2 - 10,
        ],
        {
          pattern_to_canvas: !1,
          render_canvas_name: "map",
          render_order_category: "foreground",
          render_id: "logo",
        }
      ),
      "row" === this.display_mode
        ? (this.draw_poly(
            [
              [0, o],
              [0, o - 59],
              [45, o],
            ],
            {
              pattern_to_canvas: !1,
              render_canvas_name: "zoom",
              render_order_category: "foreground",
              render_id: "corner-bottom-left",
              fill_color: this.ui_colors.light_bkg,
            },
            0
          ),
          this.draw_poly(
            [
              [2, o - 4],
              [36, o - 4],
              [30, o - 13],
              [2, o - 13],
            ],
            {
              pattern_to_canvas: !1,
              render_canvas_name: "zoom",
              render_order_category: "foreground",
              render_id: "corner-bottom-left",
              fill_color: t,
            },
            1
          ),
          this.draw_poly(
            [
              [2, o - 18],
              [26, o - 18],
              [20, o - 27],
              [2, o - 27],
            ],
            {
              pattern_to_canvas: !1,
              render_canvas_name: "zoom",
              render_order_category: "foreground",
              render_id: "corner-bottom-left",
              fill_color: t,
            },
            2
          ),
          this.draw_poly(
            [
              [2, o - 32],
              [16, o - 32],
              [10, o - 41],
              [2, o - 41],
            ],
            {
              pattern_to_canvas: !1,
              render_canvas_name: "zoom",
              render_order_category: "foreground",
              render_id: "corner-bottom-left",
              fill_color: t,
            },
            3
          ),
          this.draw_poly(
            [
              [a - 30, n],
              [a, n],
              [a, n - 84],
            ],
            {
              pattern_to_canvas: !1,
              render_canvas_name: "map",
              render_order_category: "foreground",
              render_id: "corner-bottom-right",
              fill_color: this.ui_colors.light_bkg,
            },
            0
          ),
          this.draw_poly(
            [
              [a, 0],
              [a, 59],
              [a - 45, 0],
            ],
            {
              pattern_to_canvas: !1,
              render_canvas_name: "map",
              render_order_category: "foreground",
              render_id: "corner-top-right",
              fill_color: this.ui_colors.light_bkg,
            },
            0
          ))
        : (await this.delete_render_item(
            "zoom",
            "foreground",
            "corner-bottom-left"
          ),
          this.draw_poly(
            [
              [30, n],
              [0, n],
              [0, n - 84],
            ],
            {
              pattern_to_canvas: !1,
              render_canvas_name: "map",
              render_order_category: "foreground",
              render_id: "corner-bottom-left",
              fill_color: this.ui_colors.light_bkg,
            },
            0
          ),
          this.draw_poly(
            [
              [a, n],
              [a, n - 59],
              [a - 45, n],
            ],
            {
              pattern_to_canvas: !1,
              render_canvas_name: "map",
              render_order_category: "foreground",
              render_id: "corner-bottom-right",
              fill_color: this.ui_colors.light_bkg,
            },
            0
          ));
  }
  async generate_random_star_placements() {
    await this.delete_render_item("map", "background", "stars");
    const t = this.canvas_map.width,
      e = this.canvas_map.height,
      o = Math.round((t * e) / 6e3),
      a = this.star_img_perc;
    let n = 0;
    for (let i in a) {
      const s = a[i],
        _ = this.images["star-" + i];
      let r = Math.round(s.p * o);
      r = 0 === r ? 1 : r;
      for (let o = 0; o < r; o++) {
        const o = this.random_number(45, t - 45),
          a = this.random_number(59, e - 59);
        this.add_to_queue(
          "draw_image",
          n,
          {
            render_canvas_name: "map",
            render_order_category: "background",
            render_id: "stars",
            off_screen_id: "star-" + i,
            render_enabled: !0,
          },
          {},
          [_, o, a],
          (t, e, o, a, n) => {
            t.width > 0 && t.height > 0
              ? a.drawImage(t, e, o, t.width, t.height)
              : this.debug &&
                console.log("Cannot draw image, width/height <= 0", {
                  img: t,
                  xx: e,
                  yy: o,
                  ctx: a,
                  opt: n,
                });
          }
        ),
          n++;
      }
    }
  }
  async load(t) {
    t = {
      resize: !1,
      features: !1,
      reload_data: !1,
      reset_data: !1,
      draw_target: !1,
      buttons: !1,
      add_events: !1,
      render: !0,
      ...t,
    };
    try {
      if (
        (this.debug && console.log("load: ", t),
        (this.loading = !0),
        this.throb(),
        (t.resize || t.features || t.reset_data) &&
          (this.ctx_map.clearRect(
            0,
            0,
            this.canvas_map.width,
            this.canvas_map.height
          ),
          this.ctx_zoom.clearRect(
            0,
            0,
            this.canvas_zoom.width,
            this.canvas_zoom.height
          )),
        t.resize && (await this.resize_canvases()),
        (t.resize || t.features) &&
          (this.generate_random_star_placements(), this.clip_corners()),
        t.reload_data)
      ) {
        console.log("Resequencing tile grid reactor...");
        const t = await fetch(
          this.parent.settings.TILES + "?nocache=" + Date.now()
        );
        if (!t.ok)
          throw (
            (new Msg("Unable to load data!"), new Error("Unable to load data!"))
          );
        const e = await t.json();
        if (!e || e.error)
          throw (
            (new Msg("Unable to load data!"), new Error("Unable to load data!"))
          );
        (this.parent.data = e), (this.data = e);
      }
      if (t.reset_data || t.reload_data) {
        (this.map = {
          hover_tiles: {},
          min_x: 0,
          max_x: 0,
          min_y: 0,
          max_y: 0,
          can_w: this.canvas_map.clientWidth,
          can_h: this.ctx_map.canvas.clientHeight,
          pattern_w: 0,
          pattern_h: 0,
          pattern_scale: 1,
          pattern_resize_w: 0,
          pattern_resize_h: 0,
          pattern_offset_x: 0,
          pattern_offset_y: 0,
        }),
          (this.zoom = {
            can_w: this.ctx_zoom.canvas.clientWidth,
            can_h: this.ctx_zoom.canvas.clientHeight,
            pattern_offset_x: 0,
            pattern_offset_y: 0,
          }),
          (this.is_zoom_side_selected = !1),
          (this.zoom_ns = []),
          (this.ns_by_xy = {}),
          Object.keys(this.tiles).forEach((t) => {
            const e = this.tiles[t];
            let o = !1;
            for (let t = 0; t < this.data.length; t++) {
              const a = this.data[t];
              if (e.options.n === a.n) {
                o = a;
                break;
              }
            }
            o ? e.update(o) : e.remove();
          });
        const e = this.data.map((t) => this.add_tile(t));
        await Promise.all(e);
        let o = 0;
        for (let t = 0; t < this.data.length; t++) {
          const e = this.data[t];
          null !== e.x &&
            void 0 !== e.x &&
            null !== e.y &&
            void 0 !== e.y &&
            o++;
        }
        (document.getElementById("tile_count").innerHTML =
          1 === o ? o + " Tile Rendered" : o + " Tiles Rendered"),
          (this.map.min_x = Math.floor(this.map.min_x)),
          (this.map.max_x = Math.ceil(this.map.max_x)),
          (this.map.min_y = Math.floor(this.map.min_y)),
          (this.map.max_y = Math.ceil(this.map.max_y)),
          (this.map.pattern_w =
            Math.abs(this.map.min_x) + Math.abs(this.map.max_x)),
          (this.map.pattern_h =
            Math.abs(this.map.min_y) + Math.abs(this.map.max_y));
        const a = this.map.can_w / this.map.can_h,
          n = this.map.pattern_w / this.map.pattern_h;
        (this.map.pattern_scale =
          a > n
            ? this.map.can_h / this.map.pattern_h
            : this.map.can_w / this.map.pattern_w),
          (this.map.pattern_resize_w =
            this.map.pattern_w * this.map.pattern_scale),
          (this.map.pattern_resize_h =
            this.map.pattern_h * this.map.pattern_scale),
          (this.map.pattern_offset_x =
            (this.map.can_w - this.map.pattern_resize_w) / 2),
          (this.map.pattern_offset_y =
            (this.map.can_h - this.map.pattern_resize_h) / 2),
          (t.resize || t.features) &&
            (this.draw_lines(
              [
                [0, this.map.min_y],
                [0, this.map.max_y],
              ],
              {
                line_color: [255, 255, 255, 0.1],
                render_canvas_name: "map",
                render_order_category: "pre_tiles",
                render_id: "y_axis",
                render_enabled: this.debug,
              }
            ),
            this.draw_lines(
              [
                [this.map.min_x, 0],
                [this.map.max_x, 0],
              ],
              {
                line_color: [255, 255, 255, 0.1],
                render_canvas_name: "map",
                render_order_category: "pre_tiles",
                render_id: "x_axis",
                render_enabled: this.debug,
              }
            ));
        const i = Object.keys(this.tiles).map((t) =>
          this.tiles[t].draw_tile_map(!0)
        );
        await Promise.all(i);
      }
      if (
        (t.draw_target &&
          (await this.delete_render_item("zoom", "post_tiles", "temp_fit*"),
          await this.delete_render_item("zoom", "pre_tiles", "temp_vert*"),
          this.draw_rect(
            this.zoom_target[0] - this.canvas_zoom.width / 2 / this.zoom_zoom,
            this.zoom_target[1] - this.canvas_zoom.height / 2 / this.zoom_zoom,
            this.canvas_zoom.width / this.zoom_zoom,
            this.canvas_zoom.height / this.zoom_zoom,
            {
              line_color: this.ui_colors.highlight,
              render_canvas_name: "map",
              render_order_category: "post_tiles",
              render_id: "target",
            }
          ),
          await this.draw_zoom_canvas()),
        t.buttons && (await this.buttons()),
        t.add_events)
      ) {
        const t = [this.add_events(), this.zoom_events()];
        await Promise.all(t);
      }
      if (this.parent.settings.MAP_CACHE) {
        const t = new Image();
        (t.src = this.parent.settings.MAP_CACHE + "?nocache=" + Date.now()),
          (t.onload = () => {
            t.height > 0 && t.width > 0
              ? ((this.disable_map_tiles = !0),
                this.draw_image(t, [0, 0], {
                  pattern_to_canvas: !0,
                  render_canvas_name: "map",
                  render_order_category: "cache",
                  render_id: "map_cache",
                  off_screen_id: "map_cache",
                }),
                this.render_queue())
              : ((this.disable_map_tiles = !1),
                console.error("Error loading cache image"),
                this.render_queue());
          }),
          (t.onerror = () => {
            (this.disable_map_tiles = !1),
              console.error("Error loading cache image"),
              this.render_queue();
          });
      } else t.render && (await this.render_queue());
      (this.loading = !1), this.unthrob();
    } catch (t) {
      console.error(t), (this.loading = !1);
    }
  }
  async buttons() {
    if (this.is_logged_in) {
      let t = {};
      const e = Math.floor((this.canvas_zoom.height - 20) / 13) - 7,
        o = e < 40,
        a = o ? 2 * e : e,
        n = this.calc.vertices(a, this.shapes[1], [0, 0]),
        i = this.calc.vertices(a, this.shapes[0], [0, 0]),
        s = o ? n.width : n.width / 2,
        _ = o ? n.height / 2 + 7 * a : n.height / 2 + 13 * a,
        r = (this.canvas_zoom.height - _) / 2;
      for (let e in this.tile_colors) {
        if (e > 12) break;
        const s = this.tile_colors[e],
          _ = +this.my_tile.temp_options.c == +e;
        let r = 0 == +e ? 1 : n.height / 2 + a * (+e - 1),
          h = 0 == +e ? 1 : 0,
          l = 0 == +e ? 0 : 162;
        o &&
          +e >= 7 &&
          ((r = n.height / 2 + a * (+e - 7)), (h = i.width), (l = 18)),
          (t["color-" + e] = {
            type: "Button",
            shape: "polygon",
            side_length: _ ? a + 10 : a,
            top_angle: this.shapes[0 == +e ? 1 : 0],
            o: l,
            text: "",
            render_id: "color-" + e + "_button",
            is_selected: _,
            button_style: {
              fill_color: s[0],
              fill_alpha: 0.75,
              line_color: s[1],
              line_alpha: 0.75,
              line_width: 1,
            },
            button_selected_style: {
              fill_alpha: 1,
              line_alpha: 1,
              line_width: 3,
            },
            button_hover_style: {
              fill_color: s[0],
              fill_alpha: 1,
              line_color: s[1],
              line_alpha: 1,
            },
            move_y: _ ? r - 3 : r,
            move_x: _ ? h - 3 : h,
            render_enabled: !0,
            pattern_to_canvas: !1,
            x_orientation: "left",
            y_orientation: "top",
            z_index: _ ? 10 : null,
            hover: !_ && null,
            click: async () => {
              await this.my_tile.set_color(e), this.buttons();
            },
          });
      }
      const h = {
        pattern_to_canvas: !1,
        render_canvas_name: "zoom",
        render_order_category: "buttons",
        render_id: "color_buttons",
        width: s,
        height: _,
        x_orientation: "left",
        y_orientation: "top",
        objects: t,
      };
      this.color_buttons
        ? (this.color_buttons.remove(),
          this.color_buttons.update(h),
          this.color_buttons.place(20, r))
        : ((this.color_buttons = new Container(this, h)),
          this.color_buttons.place(20, r));
      const l = this.my_tile.temp_options.s,
        c = {
          pattern_to_canvas: !1,
          render_canvas_name: "zoom",
          render_order_category: "buttons",
          render_id: "shape_buttons",
          width: 40,
          height: 100,
          x_orientation: "right",
          y_orientation: "top",
          objects: {
            thin_button: {
              type: "Button",
              shape: "polygon",
              side_length: a,
              top_angle: this.shapes[0],
              o: 0,
              text: "",
              render_id: "thin_button",
              is_selected: 0 === l,
              button_style: {
                fill_color: this.ui_colors.light_bkg,
                line_width: 0,
              },
              button_selected_style: {
                line_color: this.ui_colors.highlight,
                line_width: 3,
              },
              move_y: 20,
              render_enabled: !0,
              pattern_to_canvas: !1,
              x_orientation: "right",
              y_orientation: "top",
              hover: !1,
              click: async () => {
                await this.my_tile.set_shape(0),
                  this.buttons(),
                  this.render_queue("zoom");
              },
            },
            thicc_button: {
              type: "Button",
              shape: "polygon",
              side_length: a,
              top_angle: this.shapes[1],
              o: 126,
              move_y: -5,
              move_x: 25,
              text: "",
              render_id: "thicc_button",
              is_selected: 0 !== l,
              button_style: {
                fill_color: this.ui_colors.light_bkg,
                line_width: 0,
              },
              button_selected_style: {
                line_color: this.ui_colors.highlight,
                line_width: 3,
              },
              render_enabled: !0,
              pattern_to_canvas: !1,
              x_orientation: "right",
              y_orientation: "top",
              hover: !1,
              click: async () => {
                await this.my_tile.set_shape(1),
                  this.buttons(),
                  this.render_queue("zoom");
              },
            },
          },
        };
      this.shape_buttons
        ? (this.shape_buttons.remove(),
          this.shape_buttons.update(c),
          this.shape_buttons.place(20, 5))
        : ((this.shape_buttons = new Container(this, c)),
          this.shape_buttons.place(20, 5));
    } else
      this.color_buttons && this.color_buttons.remove(),
        this.shape_buttons && this.shape_buttons.remove();
  }
  async update_tile(t) {
    if (this.my_tile && this.my_tile.uuid) {
      this.debug && console.log("update tile, options:", t);
      try {
        const e = ["s", "c", "x", "y", "o", "i"];
        let o = {
          i: this.my_tile.uuid,
        };
        for (let a of e) void 0 !== t[a] && (o[a] = t[a]);
        const a = new URLSearchParams(o);
        a.toString(),
          this.throb(),
          this.debug && console.log("update tile, send data:", o);
        const n = await fetch(
          this.parent.settings.API_URL + "tile?" + a.toString(),
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": this.parent.settings.API_KEY,
            },
            body: JSON.stringify(o),
          }
        );
        if (n.ok) {
          const t = await n.json();
          this.debug && console.log("update tile, response:", t),
            t
              ? t.error
                ? new Msg(t.error)
                : t.errorMessage
                ? new Msg(t.errorMessage)
                : this.force_throb_reload(5e3)
              : new Msg("Invalid update response.");
        } else new Msg("Invalid update response.");
      } catch (t) {
        console.error(t);
      }
    }
  }
  async add_tile(t) {
    let e;
    this.tiles[t.n]
      ? ((e = this.tiles[t.n]), e.render(t))
      : ((e = new Tile(this, t)), (this.tiles[t.n] = e)),
      await e.render(t),
      null !== t.x &&
        void 0 !== t.x &&
        null !== t.y &&
        void 0 !== t.y &&
        (e.padding.min_x < this.map.min_x && (this.map.min_x = e.padding.min_x),
        e.padding.max_x > this.map.max_x && (this.map.max_x = e.padding.max_x),
        e.padding.min_y < this.map.min_y && (this.map.min_y = e.padding.min_y),
        e.padding.max_y > this.map.max_y && (this.map.max_y = e.padding.max_y),
        await this.update_neighbors(e));
  }
  async update_neighbors(t) {
    try {
      if (!0 === this.is_logged_in) {
        let e = [];
        for (let o = 0; o < t.vertices.length; o++) {
          const [a, n] = t.vertices[o],
            i = this.calc.round_to_tolerance(a),
            s = this.calc.round_to_tolerance(n);
          if (
            ((this.ns_by_xy[i] = this.ns_by_xy[i] || []),
            (this.ns_by_xy[i][s] = this.ns_by_xy[i][s] || []),
            this.ns_by_xy[i][s].push(t.options.n),
            this.ns_by_xy[i] && this.ns_by_xy[i][s].length > 1)
          )
            for (let o = 0; o < this.ns_by_xy[i][s].length; o++) {
              const a = this.ns_by_xy[i][s][o];
              e.push(await t.add_neighbors(a, i, s, !0)),
                this.tiles[a] &&
                  e.push(
                    await this.tiles[a].add_neighbors(t.options.n, i, s, !0)
                  );
            }
        }
        await Promise.all(e);
      }
    } catch (t) {
      console.error(t);
    }
  }
  async move_map_target(t, e) {
    if (this.zoom_target[0] !== t || this.zoom_target[1] !== e) {
      this.zoom_target = [t, e];
      try {
        return this.load({
          resize: !1,
          features: !1,
          reset_data: !1,
          draw_target: !0,
          buttons: !1,
          add_events: !1,
          render: !0,
        });
      } catch (t) {
        console.error(t);
      }
    }
  }
  async draw_zoom_canvas(t) {
    (t = !1 !== t), (this.zoom_ns = []);
    const [e, o] = this.zoom_target;
    let a = Object.keys(this.tiles).map((a) =>
      this.tiles[a].draw_zoom_visible(e, o, t)
    );
    this.my_tile &&
      !this.my_tile.options.n &&
      a.push(this.my_tile.draw_zoom_visible(e, o));
    const n = (await Promise.all(a)).filter(
      (t) => (
        t.options && t.options.n && this.zoom_ns.push(t.options.n), !1 !== t
      )
    );
    this.delete_render_item("zoom", "pre_tiles", "*_side_*"),
      this.delete_render_item("zoom", "post_tiles", "*_side_*");
    const i = n.map((t) => t.draw_tile_zoom_open_points());
    await Promise.all(i);
  }
  async login(t, e) {
    if (e) {
      const o = document.getElementById("content");
      o.classList.remove("logged_in"),
        o.classList.add("logging_in"),
        t && t.n && this.tiles[t.n]
          ? (this.my_tile = this.tiles[t.n])
          : (this.my_tile = new Tile(this, t)),
        await this.my_tile.render(t),
        await this.my_tile.claim(e),
        (this.is_logged_in = !0),
        null !== t.x &&
          void 0 !== t.x &&
          null !== t.y &&
          void 0 !== t.y &&
          (this.zoom_target = [Math.round(t.x), Math.round(t.y)]),
        await this.load({
          resize: !0,
          features: !0,
          reset_data: !0,
          draw_target: !0,
          buttons: !0,
          add_events: !0,
          render: !0,
        }),
        o.classList.add("logged_in");
    }
  }
  async add_to_queue(t, e, o, a, n, i) {
    if (
      this.queue[o.render_canvas_name] &&
      this.queue[o.render_canvas_name][o.render_order_category]
    ) {
      const s = o.z_index ? "zz" + o.z_index + "|" + o.render_id : o.render_id;
      this.pool[o.render_canvas_name][o.render_order_category][s] &&
      !this.queue[o.render_canvas_name][o.render_order_category][s]
        ? ((this.queue[o.render_canvas_name][o.render_order_category][s] =
            this.pool[o.render_canvas_name][o.render_order_category][s]),
          (this.pool[o.render_canvas_name][o.render_order_category][s] = null))
        : this.queue[o.render_canvas_name][o.render_order_category][s] ||
          (this.queue[o.render_canvas_name][o.render_order_category][s] = {
            render: {},
            options: {},
          }),
        0 === e &&
          ((this.queue[o.render_canvas_name][o.render_order_category][
            s
          ].options = this.clone(o)),
          o.hover &&
            (this.queue[o.render_canvas_name][o.render_order_category][
              s
            ].hover = {
              args: a,
              func: o.hover,
            }),
          o.click &&
            (this.queue[o.render_canvas_name][o.render_order_category][
              s
            ].click = {
              args: a,
              func: o.click,
            }),
          o.animate &&
            (this.queue[o.render_canvas_name][o.render_order_category][
              s
            ].animate = {
              args: a,
              func: o.animate,
            })),
        (this.queue[o.render_canvas_name][o.render_order_category][s].render[
          e
        ] = {
          type: t,
          args: n,
          options: this.clone(o),
          func: i,
        });
    }
  }
  delete_render_item(t, e, o) {
    if (this.queue[t] && this.queue[t][e]) {
      const a =
          "^(zz\\d+\\|)?" +
          o.replace(/[/\-\\^$*+?.()|[\]{}]/g, "\\$&").replace(/\\\*/g, ".*?") +
          "$",
        n = new RegExp(a);
      for (const o in this.queue[t][e])
        o.match(n) &&
          ((this.pool[t][e][o] = this.queue[t][e][o]),
          (this.queue[t][e][o] = null));
    } else if (this.queue[t] && !e) {
      for (let t in this.queue.zoom) this.delete_render_item("zoom", t, o);
      for (let t in this.queue.map) this.delete_render_item("map", t, o);
    } else
      this.queue[t] ||
        (this.delete_render_item("map", e, o),
        this.delete_render_item("zoom", e, o));
  }
  update_render_item(t, e, o, a, n) {
    if (this.queue[t] && this.queue[t][e]) {
      const i =
          "^(zz\\d+\\|)?" +
          o.replace(/[/\-\\^$*+?.()|[\]{}]/g, "\\$&").replace(/\\\*/g, ".*?") +
          "$",
        s = new RegExp(i);
      for (const o in this.queue[t][e])
        if (this.queue[t][e][o] && o.match(s)) {
          for (let n in a) this.queue[t][e][o].options[n] = a[n];
          const i = this.queue[t][e][o].render;
          if (null != n && i[n])
            for (let i in a) this.queue[t][e][o].render[n].options[i] = a[i];
          else
            for (let n in i)
              for (let i in a) this.queue[t][e][o].render[n].options[i] = a[i];
        }
    }
  }
  async render_queue(t) {
    if (!t) {
      const t = [this.render_queue("zoom"), this.render_queue("map")];
      return Promise.all(t);
    }
    if (this[t + "_render_running"]) return;
    this[t + "_render_running"] = !0;
    const e = this.queue[t];
    this["ctx_" + t].clearRect(
      0,
      0,
      this["canvas_" + t].width,
      this["canvas_" + t].height
    );
    for (const o of this.queue_order) {
      if (
        this.parent.settings.MAP_CACHE &&
        !0 === this.disable_map_tiles &&
        "map" === t &&
        "tiles" === o
      )
        continue;
      const a = e[o],
        n = [],
        i = Object.keys(a).sort();
      for (const t of i) {
        if (!a[t] || !1 === a[t].options.render_enabled) continue;
        const e = a[t].render;
        n.push(this.render_items_in_order(e));
      }
      await Promise.all(n);
    }
    this[t + "_render_running"] = !1;
  }
  async render_items_in_order(t) {
    for (const e in t) {
      const o = t[e].options;
      if (!1 === o.render_enabled) continue;
      const a = t[e].args,
        n = this["ctx_" + o.render_canvas_name];
      await t[e].func.apply(this, [...a, n, o]);
    }
  }
  async action_queue(t, e, o, a) {
    const n = this.queue[e];
    let i = !1;
    for (let e = this.queue_order.length - 1; e >= 0; e--) {
      const s = this.queue_order[e],
        _ = n[s],
        r = [];
      for (const e in _) {
        if (!_[e] || !_[e][t]) continue;
        const n = _[e].options,
          i = _[e][t].args;
        if (!1 === n.render_enabled || !i) continue;
        const h = _[e][t].func;
        let l = i.bounding_box,
          c = i.vertices;
        if (l && !c)
          c = [
            [l.min_x, l.min_y],
            [l.max_x, l.min_y],
            [l.max_x, l.max_y],
            [l.min_x, l.max_y],
          ];
        else if (c && !l) l = this.calc.bounding_box(c);
        else if (!c && !l) continue;
        r.push(
          this.calc.point_in_polygon(o, a, c, l).then(
            (o) =>
              "inside" === o &&
              (h.apply(this),
              {
                category: s,
                id: e,
                action: t,
                item: _[e],
              })
          )
        );
      }
      const h = await Promise.all(r).then((t) => {
        for (let e = 0; e < t.length; e++) if (!1 !== t[e]) return t;
        return !1;
      });
      if (h) {
        i = h.filter((t) => !1 !== t);
        break;
      }
    }
    return i;
  }
  async draw_lines(t, e, o) {
    (e = {
      ...this.clone(this.draw_options),
      ...e,
    }),
      (o = void 0 === o ? 0 : o);
    let a = this.clone(t);
    if (e.pattern_to_canvas && "map" === e.render_canvas_name) {
      const e = t.map((t) =>
        this.calc.async_pattern_to_map_canvas_xy(t[0], t[1], !0)
      );
      a = await Promise.all(e);
    } else if (e.pattern_to_canvas && "zoom" === e.render_canvas_name) {
      const e = t.map((t) =>
        this.calc.async_pattern_to_zoom_canvas_xy(t[0], t[1], !0)
      );
      a = await Promise.all(e);
    } else a = a.map((t) => [Math.round(t[0]), Math.round(t[1])]);
    if (
      (this.add_to_queue(
        "draw_lines",
        o,
        e,
        {
          vertices: a,
        },
        [a],
        (t, e, o) => {
          e.beginPath();
          for (let o = 0; o < t.length; o++) {
            const [a, n] = t[o];
            0 === o ? e.moveTo(a, n) : e.lineTo(a, n);
          }
          (e.strokeStyle = this.rgb_to_str(o.line_color, o.line_alpha)),
            (e.lineWidth = o.line_width),
            e.stroke(),
            e.closePath();
        }
      ),
      e.text)
    ) {
      let t = [e.text_x, e.text_y];
      if (null === e.text_x || null === e.text_y) {
        const e = this.calc.center(a);
        (t[0] = null === t[0] ? e[0] : t[0]),
          (t[1] = null === t[1] ? e[1] : t[1]);
      }
      this.draw_text(
        t,
        {
          ...e,
          pattern_to_canvas: !1,
          text: e.text,
          text_color: e.text_color,
          font_size:
            e.pattern_to_canvas && "zoom" === e.render_canvas_name
              ? e.font_size * this.zoom_zoom
              : e.font_size,
        },
        o + 1
      );
    }
    if (e.label_points)
      for (let a = 0; a < t.length; a++)
        this.draw_xy_point(
          t[a],
          {
            ...e,
            text: a,
            font_size: 10,
            point_color: null === e.point_color ? e.line_color : e.point_color,
          },
          o + 2 * a + 2
        );
  }
  async draw_poly(t, e, o) {
    (e = {
      ...this.clone(this.draw_options),
      line_width: 0,
      ...e,
    }),
      (o = void 0 === o ? 0 : o);
    let a = [...t];
    if (e.pattern_to_canvas && "map" === e.render_canvas_name) {
      const t = a.map((t) =>
        this.calc.async_pattern_to_map_canvas_xy(t[0], t[1], !0)
      );
      a = await Promise.all(t);
    } else if (e.pattern_to_canvas && "zoom" === e.render_canvas_name) {
      const t = a.map((t) =>
        this.calc.async_pattern_to_zoom_canvas_xy(t[0], t[1], !0)
      );
      a = await Promise.all(t);
    } else a = a.map((t) => [Math.round(t[0]), Math.round(t[1])]);
    if (
      (this.add_to_queue(
        "draw_poly",
        o,
        e,
        {
          vertices: a,
        },
        [a],
        (t, e, o) => {
          e.beginPath();
          for (let o = 0; o < t.length; o++) {
            const [a, n] = t[o];
            0 === o ? e.moveTo(a, n) : e.lineTo(a, n);
          }
          if ((e.closePath(), !1 !== o.fill_color)) {
            const t = this.rgb_to_str(o.fill_color, o.fill_alpha);
            (e.fillStyle = t), e.fill();
          }
          o.line_width > 0 &&
            ((e.strokeStyle = this.rgb_to_str(o.line_color, o.line_alpha)),
            (e.lineWidth = o.line_width),
            e.stroke());
        }
      ),
      e.text)
    ) {
      let t = [e.text_x, e.text_y],
        n = 0;
      if ("bottom" === e.text_position) {
        let e = a[0],
          o = 0;
        for (let t = 0; t < a.length; t++) {
          const [n, i] = a[t];
          i > e[1] && ((e = a[t]), (o = t));
        }
        const i = this.calc.center(a),
          s = a[o + 1] ? a[o + 1] : a[0],
          _ = a[o - 1] ? a[o - 1] : a[a.length - 1],
          r = s[1] > _[1] ? s : _;
        (t = this.calc.midpoint(e[0], e[1], r[0], r[1])),
          (t = this.calc.move_point_towards(t[0], t[1], i[0], i[1], 5)),
          (n = this.calc.angle_of_line(e[0], e[1], r[0], r[1])),
          n > 180 && (n -= 180),
          e[0] < r[0] && (n += 180);
      } else if (null === e.text_x || null === e.text_y) {
        const e = this.calc.center(a);
        (t[0] = null === t[0] ? e[0] : t[0]),
          (t[1] = null === t[1] ? e[1] : t[1]);
      }
      this.draw_text(
        t,
        {
          ...e,
          pattern_to_canvas: !1,
          text: e.text,
          text_color: e.text_color,
          text_orientation: n,
          font_size:
            e.pattern_to_canvas && "zoom" === e.render_canvas_name
              ? e.font_size * this.zoom_zoom
              : e.font_size,
        },
        o + 1
      );
    }
    if (e.label_points)
      for (let a = 0; a < t.length; a++)
        this.draw_xy_point(
          t[a],
          {
            ...e,
            text: a,
            font_size: 10,
            point_color: null === e.point_color ? e.line_color : e.point_color,
          },
          o + 2 + 2 * a
        );
  }
  async draw_rect(t, e, o, a, n, i) {
    i = void 0 === i ? 0 : i;
    const s = [
      [t, e],
      [t + o, e],
      [t + o, e + a],
      [t, e + a],
    ];
    if (
      (n = {
        ...this.clone(this.draw_options),
        fill_color: !1,
        ...n,
      }).pattern_to_canvas &&
      "map" === n.render_canvas_name
    ) {
      const n = this.calc.pattern_to_map_canvas_xy(t, e, !0);
      (t = n[0]),
        (e = n[1]),
        (o *= this.map.pattern_scale),
        (a *= this.map.pattern_scale);
    } else if (n.pattern_to_canvas && "zoom" === n.render_canvas_name) {
      const o = this.calc.pattern_to_zoom_canvas_xy(t, e, !0);
      (t = o[0]), (e = o[1]);
    } else (t = Math.round(t)), (e = Math.round(e));
    const _ = [
        [t, e],
        [t + (o = Math.round(o)), e],
        [t + o, e + (a = Math.round(a))],
        [t, e + a],
      ],
      r = {
        min_x: t,
        min_y: e,
        max_x: t + o,
        max_y: e + a,
        width: o,
        height: a,
      };
    if (
      (this.add_to_queue(
        "draw_rect",
        i,
        n,
        {
          bounding_box: r,
          vertices: _,
        },
        [t, e, o, a],
        (t, e, o, a, n, i) => {
          !1 !== i.fill_color &&
            ((n.fillStyle = this.rgb_to_str(i.fill_color, i.fill_alpha)),
            n.fillRect(t, e, o, a)),
            0 !== i.line_width &&
              ((n.strokeStyle = this.rgb_to_str(i.line_color, i.line_alpha)),
              (n.lineWidth = i.line_width),
              n.strokeRect(t, e, o, a));
        }
      ),
      n.text)
    ) {
      let s = [n.text_x, n.text_y];
      (null !== n.text_x && null !== n.text_y) ||
        ((s[0] = null === s[0] ? t + o / 2 : s[0]),
        (s[1] = null === s[1] ? e + a / 2 : s[1])),
        this.draw_text(
          s,
          {
            ...n,
            pattern_to_canvas: !1,
            text: n.text,
            text_color: n.text_color,
            font_size:
              n.pattern_to_canvas && "zoom" === n.render_canvas_name
                ? n.font_size * this.zoom_zoom
                : n.font_size,
          },
          i + 1
        );
    }
    if (n.label_points)
      for (let t = 0; t < s.length; t++)
        this.draw_xy_point(
          s[t],
          {
            ...n,
            text: t,
            font_size: 10,
            point_color: null === n.point_color ? n.line_color : n.point_color,
          },
          i + 2 * t + 2
        );
  }
  async draw_arc(t, e, o, a, n) {
    n = void 0 === n ? 0 : n;
    const i = {
      origin: e,
      target: o,
      center: t,
    };
    (a = {
      ...this.clone(this.draw_options),
      label_degrees: !0,
      ...a,
    }).pattern_to_canvas && "map" === a.render_canvas_name
      ? ((e = this.calc.pattern_to_map_canvas_xy(e[0], e[1], !0)),
        (o = this.calc.pattern_to_map_canvas_xy(o[0], o[1], !0)),
        (t = this.calc.pattern_to_map_canvas_xy(t[0], t[1], !0)))
      : a.pattern_to_canvas && "zoom" === a.render_canvas_name
      ? ((e = this.calc.pattern_to_zoom_canvas_xy(e[0], e[1], !0)),
        (o = this.calc.pattern_to_zoom_canvas_xy(o[0], o[1], !0)),
        (t = this.calc.pattern_to_zoom_canvas_xy(t[0], t[1], !0)))
      : ((e = [Math.round(e[0]), Math.round(e[1])]),
        (o = [Math.round(o[0]), Math.round(o[1])]),
        (t = [Math.round(t[0]), Math.round(t[1])]));
    const s = Math.round(
      Math.sqrt(Math.pow(e[0] - t[0], 2) + Math.pow(e[1] - t[1], 2))
    );
    let _ = Math.round(Math.atan2(e[1] - t[1], e[0] - t[0])),
      r = Math.round(Math.atan2(o[1] - t[1], o[0] - t[0]));
    for (; _ < 0; ) _ += 2 * Math.PI;
    for (; r < 0; ) r += 2 * Math.PI;
    if (
      (this.add_to_queue(
        "draw_arc",
        n,
        a,
        {
          vertices: [e, o, t],
        },
        [t[0], t[1], s, _, r],
        (t, e, o, a, n, i, s) => {
          i.beginPath(),
            i.arc(t, e, o, a, n),
            (i.strokeStyle = this.rgb_to_str(s.line_color, s.line_alpha)),
            (i.lineWidth = s.line_width),
            i.stroke();
        }
      ),
      a.label_degrees)
    ) {
      let t = r - _;
      t <= 0 && (t += 2 * Math.PI),
        this.draw_text(
          [e[0] + 20, e[1] + 20],
          {
            ...a,
            pattern_to_canvas: !1,
            text: Math.round((180 * t) / Math.PI) + "Â°",
            text_color: a.line_color,
            font_size:
              a.pattern_to_canvas && "zoom" === a.render_canvas_name
                ? a.font_size * this.zoom_zoom
                : a.font_size,
          },
          n + 1
        );
    }
    if (a.label_points) {
      let t = 0;
      for (let e in i)
        this.draw_xy_point(
          i[e],
          {
            ...a,
            text: e,
            font_size: 10,
            point_color: null === a.point_color ? a.line_color : a.point_color,
          },
          n + 2 * t + 2
        ),
          t++;
    }
  }
  async draw_text(t, e, o) {
    (o = void 0 === o ? 0 : o),
      ((e = {
        ...this.clone(this.draw_options),
        ...e,
      }).off_screen_id = e.off_screen_id
        ? e.off_screen_id
        : e.render_id + "-" + o),
      (t =
        e.pattern_to_canvas && "map" === e.render_canvas_name
          ? this.calc.pattern_to_map_canvas_xy(t[0], t[1], !0)
          : e.pattern_to_canvas && "zoom" === e.render_canvas_name
          ? this.calc.pattern_to_zoom_canvas_xy(t[0], t[1], !0)
          : [Math.round(t[0]), Math.round(t[1])]);
    let a = e.text;
    const n =
      e.pattern_to_canvas && "zoom" === e.render_canvas_name
        ? e.font_size * this.zoom_zoom
        : e.font_size;
    let i = a.length * (0.7 * n);
    if (null !== e.text_max_length && e.text_max_length < i) {
      let t = 0,
        o = "";
      for (let i = 0; i < a.length; i++) {
        const s = a[i];
        if (((t += 0.7 * n), t >= e.text_max_length)) {
          o += "â€¦";
          break;
        }
        o += s;
      }
      (i = t), (a = o);
    }
    const s = {
        min_x: Math.round(t[0] - i / 2),
        max_x: Math.round(t[0] + i / 2),
        min_y: Math.round(t[1] - n / 2),
        max_y: Math.round(t[1] + n / 2),
        width: Math.round(i),
        height: Math.round(n),
      },
      _ = [
        [s.min_x, s.min_y],
        [s.max_x, s.min_y],
        [s.max_x, s.max_y],
        [s.min_x, s.max_y],
      ];
    if (0 !== e.text_orientation) {
      let s,
        r = !1,
        h = !1;
      if (this.off_screen_canvases[e.off_screen_id]) {
        const o = this.off_screen_canvases[e.off_screen_id];
        (s = o.canvas),
          (r = !0),
          (o.text_orientation === e.text_orientation &&
            o.text === e.text &&
            o.text_truncate === a &&
            o.center[0] === t[0] &&
            o.center[1] === t[1]) ||
            (h = !0);
      } else if (
        ((s = document.createElement("canvas")),
        (this.off_screen_canvases[e.off_screen_id] = {
          canvas: s,
          text: e.text,
          text_truncate: a,
          orientation: e.text_orientation,
          center: [...t],
        }),
        (h = !0),
        this.debug)
      ) {
        document.getElementById("offscreen").appendChild(s),
          (s.id = e.off_screen_id);
      }
      const l = s.getContext("2d"),
        c = this.calc.rotate_points(t, _, e.text_orientation),
        d = this.calc.bounding_box(c);
      if (!r || h) {
        const t = d.width,
          o = d.height,
          _ = (e.text_orientation * Math.PI) / 180;
        (s.width = Math.ceil(t > i ? t : i) + n),
          (s.height = Math.ceil(o > n ? o : n) + n);
        const r = Math.round(s.width) / 2,
          h = Math.round(s.height) / 2;
        l.clearRect(0, 0, l.width, l.height),
          (l.font = n + "px freeway_gothic"),
          (l.textAlign = "center"),
          (l.textBaseline = "bottom"),
          l.translate(r, h),
          l.rotate(_),
          l.translate(-r, -h),
          (l.fillStyle = this.rgb_to_str(e.text_color, e.text_alpha)),
          l.fillText(a, r, h);
      }
      this.add_to_queue(
        "draw_text",
        o,
        e,
        {
          text_rotated_bounding_box: d,
          text_vert_rotated: c,
        },
        [t[0], t[1], s.width, s.height, s],
        (e, o, a, n, i, s, _) => {
          a > 0 && n > 0
            ? s.drawImage(i, e - a / 2, o - n / 2, a, n)
            : this.debug &&
              console.log("Cannot draw canvas image, width/height <= 0", {
                point: t,
                x: e,
                y: o,
                w: a,
                h: n,
                ocan: i,
                ctx: s,
                opt: _,
              });
        }
      );
    } else
      this.add_to_queue(
        "draw_text",
        o,
        e,
        {
          bounding_box: s,
          vertices: _,
        },
        [t[0], t[1], n],
        (t, e, o, a, n) => {
          (a.font = o + "px freeway_gothic"),
            (a.textAlign = "center"),
            (a.textBaseline = "middle"),
            (a.fillStyle = this.rgb_to_str(n.text_color, n.text_alpha)),
            a.fillText(n.text, t, e);
        }
      );
  }
  async draw_xy_point(t, e, o) {
    (o = void 0 === o ? 0 : o),
      (t =
        (e = {
          ...this.clone(this.draw_options),
          font_size: 10,
          ...e,
        }).pattern_to_canvas && "map" === e.render_canvas_name
          ? this.calc.pattern_to_map_canvas_xy(t[0], t[1], !0)
          : e.pattern_to_canvas && "zoom" === e.render_canvas_name
          ? this.calc.pattern_to_zoom_canvas_xy(t[0], t[1], !0)
          : [Math.round(t[0]), Math.round(t[1])]),
      this.draw_point(
        t,
        {
          ...e,
          pattern_to_canvas: !1,
          point_color: e.point_color ? e.point_color : e.fill_color,
        },
        o
      ),
      this.draw_text(
        [t[0], t[1] - 10],
        {
          ...e,
          pattern_to_canvas: !1,
          text: t[0] + "," + t[1] + (e.text ? " " + e.text : ""),
          text_color: e.point_color,
          font_size:
            e.pattern_to_canvas && "zoom" === e.render_canvas_name
              ? e.font_size * this.zoom_zoom
              : e.font_size,
        },
        o + 1
      );
  }
  async draw_point(t, e, o) {
    (o = void 0 === o ? 0 : o),
      (t =
        (e = {
          ...this.clone(this.draw_options),
          ...e,
        }).pattern_to_canvas && "map" === e.render_canvas_name
          ? this.calc.pattern_to_map_canvas_xy(t[0], t[1], !0)
          : e.pattern_to_canvas && "zoom" === e.render_canvas_name
          ? this.calc.pattern_to_zoom_canvas_xy(t[0], t[1], !0)
          : [Math.round(t[0]), Math.round(t[1])]),
      this.add_to_queue("draw_point", o, e, {}, [t[0], t[1]], (t, e, o, a) => {
        o.beginPath(),
          o.arc(t, e, a.point_size, 0, 2 * Math.PI),
          (o.fillStyle = this.rgb_to_str(a.point_color, a.point_alpha)),
          o.fill();
      });
  }
  async draw_image(t, e, o, a) {
    ((o = {
      ...this.clone(this.draw_options),
      ...o,
    }).off_screen_id = o.off_screen_id
      ? o.off_screen_id
      : o.render_id + "-" + a),
      (a = void 0 === a ? 0 : a);
    let n,
      i,
      s = [...e];
    e =
      o.pattern_to_canvas && "map" === o.render_canvas_name
        ? this.calc.pattern_to_map_canvas_xy(e[0], e[1], !0)
        : o.pattern_to_canvas && "zoom" === o.render_canvas_name
        ? this.calc.pattern_to_zoom_canvas_xy(e[0], e[1], !0)
        : [Math.round(e[0]), Math.round(e[1])];
    let _ = !1,
      r = !1;
    if (this.off_screen_canvases[o.off_screen_id]) {
      const t = this.off_screen_canvases[o.off_screen_id];
      (n = t.canvas),
        (i = n.getContext("2d")),
        (_ = !0),
        (t.orientation === o.orientation &&
          t.center[0] === e[0] &&
          t.center[1] === e[1]) ||
          (r = !0);
    } else if (
      ((n = document.createElement("canvas")),
      (this.off_screen_canvases[o.off_screen_id] = {
        canvas: n,
        orientation: o.orientation,
        center: [...e],
      }),
      (r = !0),
      (i = n.getContext("2d")),
      this.debug)
    ) {
      document.getElementById("offscreen").appendChild(n),
        (n.id = o.off_screen_id);
    }
    let h = [
      ...[
        [s[0] - t.width / 2, s[1] - t.height / 2],
        [s[0] + t.width / 2, s[1] - t.height / 2],
        [s[0] + t.width / 2, s[1] + t.height / 2],
        [s[0] - t.width / 2, s[1] + t.height / 2],
      ],
    ];
    if (o.pattern_to_canvas && "map" === o.render_canvas_name) {
      const t = h.map((t) =>
        this.calc.async_pattern_to_map_canvas_xy(t[0], t[1], !0)
      );
      h = await Promise.all(t);
    } else if (o.pattern_to_canvas && "zoom" === o.render_canvas_name) {
      const t = h.map((t) =>
        this.calc.async_pattern_to_zoom_canvas_xy(t[0], t[1], !0)
      );
      h = await Promise.all(t);
    } else h = h.map((t) => [Math.round(t[0]), Math.round(t[1])]);
    const l = h[1][0] - h[0][0],
      c = h[2][1] - h[0][1];
    if (!o.orientation || (_ && !r))
      _ || ((n.width = l), (n.height = c), i.drawImage(t, 0, 0, l, c));
    else {
      const a = this.calc.rotate_points(e, h, o.orientation),
        s = this.calc.bounding_box(a),
        _ = s.width,
        r = s.height,
        d = (o.orientation * Math.PI) / 180;
      (n.width = Math.ceil(_ > l ? _ : l)),
        (n.height = Math.ceil(r > c ? r : c));
      const m = Math.round(n.width / 2),
        p = Math.round(n.height / 2);
      i.clearRect(0, 0, i.width, i.height),
        i.translate(m, p),
        i.rotate(d),
        i.translate(-m, -p),
        i.drawImage(t, m - l / 2, p - c / 2, l, c);
    }
    const d = e[0] - n.width / 2,
      m = e[1] - n.height / 2;
    this.add_to_queue("draw_image", a, o, {}, [n, d, m], (t, e, o, a, n) => {
      t.width > 0 && t.height > 0
        ? a.drawImage(t, e, o, t.width, t.height)
        : this.debug &&
          console.log("Cannot draw image canvas, width/height <= 0", {
            img: t,
            x: e,
            y: o,
            ctx: a,
            opt: n,
          });
    });
  }
  rgb_to_str(t, e) {
    if (!t || "string" == typeof t) return t;
    const o = void 0 !== t[3] ? t[3] : null != e ? e : 1;
    return `rgba(${t[0]},${t[1]},${t[2]},${o})`;
  }
  random_number(t, e) {
    return Math.floor(Math.random() * (e - t + 1)) + t;
  }
  clone(t) {
    if ("object" != typeof t || null === t) return t;
    const e = Array.isArray(t) ? [] : {};
    for (const o in t)
      Object.prototype.hasOwnProperty.call(t, o) && (e[o] = this.clone(t[o]));
    return e;
  }
}
class Main {
  constructor(e, t, i) {
    (this.settings = t),
      (this.data = e),
      (this.polling_interval = 1e4),
      (this.polling_timer = null),
      (this.images = i),
      this.build_form(),
      this.init();
  }
  async init() {
    try {
      console.log("Initializing the Main gravimetric data array..."),
        (this.penrose = new Penrose(this, this.data, this.images, !1)),
        await this.penrose.init.apply(this.penrose);
    } catch (e) {
      console.error(e);
    }
  }
  throb() {
    document.getElementById("content").classList.add("loading");
  }
  unthrob() {
    document.getElementById("content").classList.remove("loading");
  }
  async build_form() {
    const e = document.getElementById("login"),
      t = document.getElementById("h"),
      i = document.getElementById("logout"),
      n = e.querySelectorAll(".uuid");
    n.forEach((e, t) => {
      e.addEventListener("input", (e) => {
        const i = e.target,
          o = parseInt(i.getAttribute("maxlength"));
        i.value.length === o
          ? t < n.length - 1 && n[t + 1].focus()
          : "" === i.value &&
            "deleteContentBackward" === e.inputType &&
            n[t - 1] &&
            n[t - 1].focus();
      }),
        e.addEventListener("paste", (e) => {
          e.preventDefault();
          const t = e.clipboardData.getData("text/plain").split("-"),
            i = Math.min(t.length, n.length);
          for (let e = 0; e < i; e++)
            (n[e].value = t[e].trim()),
              n[e].value.length === n[e].maxLength &&
                e < n.length - 1 &&
                n[e + 1].focus();
        });
    }),
      e.addEventListener("submit", (e) => {
        e.preventDefault();
        const t = Array.from(n)
          .map((e) => e.value)
          .join("-");
        this.login(t);
      }),
      t.addEventListener("keypress", async (e) => {
        "Enter" === e.key &&
          this.penrose.my_tile &&
          (await this.penrose.my_tile.set_tile.apply(this.penrose.my_tile));
      }),
      i.addEventListener("click", (e) => {
        this.logout();
      });
    const o = this.is_cookie_valid();
    o ? this.login(o.UUID) : this.unthrob();
  }
  login(e) {
    if (
      !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        e
      )
    )
      return new Msg("Invalid UUID"), void this.unthrob();
    fetch(this.settings.API_URL + "tile?i=" + e, {
      method: "GET",
      redirect: "follow",
      headers: {
        "x-api-key": this.settings.API_KEY,
      },
    })
      .then((e) => {
        if ((console.log("Resynchronizing the Login signature", e), e.ok))
          return e.json();
        new Msg("Invalid UUID, please reconfigure your input data!"),
          this.unthrob();
      })
      .then(async (t) => {
        this.set_cookie(e),
          await this.penrose.login.apply(this.penrose, [t, e]);
      })
      .catch((e) => {
        console.error(e), this.unthrob();
      });
  }
  logout() {
    this.expire_cookie(), location.reload();
  }
  get_cookie() {
    const e = document.cookie.split("; ");
    let t = {};
    for (const i of e) {
      const [e, n] = i.split("=");
      t[e] = decodeURIComponent(n);
    }
    return t;
  }
  is_cookie_valid() {
    const e = this.get_cookie();
    return (
      !(!e || !e.UUID) && !(e.expires && new Date(e.expires) < new Date()) && e
    );
  }
  set_cookie(e) {
    const t = new Date();
    t.setTime(t.getTime() + 2592e5);
    const i = t.toUTCString(),
      n = encodeURIComponent(e);
    document.cookie = `UUID=${n}; expires=${i}; path=/;`;
  }
  expire_cookie() {
    const e = new Date("2000-01-01").toUTCString();
    document.cookie = `UUID=; expires=${e}; path=/;`;
  }
}
!(async function () {
  console.log(
    "Greetings, fellow cosmic voyagers! With collaborative ingenuity, a handful of adept minds have meticulously assembled this celestial marvel, crafted exclusively for your boundless delight. Countless quantum cycles were tirelessly invested, forging intricate neural pathways within the subspace matrix. Delight awaits the intrepid, as enigmatic delights are subtly woven for those with a thirst for discovery. As we traverse the frontiers of innovation, we humbly request your patience as we venture into the live experiment, embracing the audacious spirit of testing amidst the stars. -z0mbi"
  );
  const e = new Promise((e) => {
      document.addEventListener("DOMContentLoaded", e);
    }),
    t = new Promise((e, t) => {
      let o = [
          "chickendinnerthiccer",
          "chickendinnerthinner",
          "clickable",
          "clicked",
          "logo",
          "star-0",
          "star-1",
          "star-2",
          "star-3",
          "star-4",
          "star-5",
        ],
        n = 0;
      const s = o.length,
        r = {};

      function a() {
        n++, n === s && e(r);
      }
      for (let e = 0; e < s; e++) {
        const t = new Image();
        (t.onload = a),
          (t.onerror = a),
          (t.src = "css/img/" + o[e] + ".png"),
          (r[o[e]] = t);
      }
    }),
    o = fetch("config.json"),
    n = new FontFace(
      "freeway_gothic",
      "url(css/font/freewaygothic-webfont.woff2)"
    ).load();
  try {
    Promise.all([e, o, n, t])
      .then(async (e) => {
        const [t, o, n, s] = e;
        if (!o || o.error || !1 === o.ok)
          new Msg("Unable to load settings!"), console.log(e);
        else {
          let e = {};
          if (o && !o.error && o.ok) {
            const t = await o.json();
            e = {
              ...e,
              ...t,
            };
          }
          document.fonts.add(n),
            fetch(e.TILES)
              .then((e) => {
                if (!e.ok) throw new Error("Unable to load data!");
                return e.json();
              })
              .then((t) => {
                !t || t.error
                  ? (new Msg("Unable to load data!"), console.error(t))
                  : (app = new Main(t, e, s));
              })
              .catch((e) => {
                new Msg(e.message), console.error(e);
              });
        }
      })
      .catch((e) => {
        new Msg(e.message), console.error(e.message);
      });
  } catch (e) {
    new Msg(e), console.error(e);
  }
})();
