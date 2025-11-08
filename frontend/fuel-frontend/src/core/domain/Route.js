export class Route {
  constructor(route_id, ship_type, fuel_type, year, ghg_intensity, fuel_consumption, distance, energy) {
    this.route_id = route_id;
    this.ship_type = ship_type;
    this.fuel_type = fuel_type;
    this.year = year;
    this.ghg_intensity = ghg_intensity;
    this.fuel_consumption = fuel_consumption;
    this.distance = distance;
    this.energy = energy;
  }
}
