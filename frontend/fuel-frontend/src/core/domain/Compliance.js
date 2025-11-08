export class Compliance {
  constructor(ship_id, year, cb_gco2eq, applied = 0) {
    this.ship_id = ship_id;
    this.year = year;
    this.cb_gco2eq = cb_gco2eq;
    this.applied = applied;
  }
}
