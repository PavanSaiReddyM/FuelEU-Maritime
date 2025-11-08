import { computeComplianceBalance } from "../utilis/formula.js";

export function calculateCB(actualIntensity, fuelConsumption_tonnes) {
   
    const energy = fuelConsumption_tonnes * 41000; 
    

    return computeComplianceBalance(actualIntensity, energy);
}