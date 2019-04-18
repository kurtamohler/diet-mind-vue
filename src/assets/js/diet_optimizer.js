export {optimize_diet}

const solver = require('javascript-lp-solver')

// Remove constraints incrementally to find out which could be removed
// to get a feasible result
function find_infeasible_constraints(solver, origModel) {
    let infeasibleConstraints = {
        'foods': [],
        'nutrients': []
    }

    // Make a deep copy of the constraints so that we don't modify
    // the original model
    let model = {
        'optimize': origModel.optimize,
        'opType': origModel.opType,
        'constraints': JSON.parse(JSON.stringify(origModel.constraints)),
        'variables': origModel.variables,
    }

    let constraintTypes = ['min', 'max']

    // Try disabling one constraint at a time and rerunning the solver
    for (let key in model.constraints) {
        let constraint = model.constraints[key]

        for (let constraintTypeIdx in constraintTypes) {
            let constraintType = constraintTypes[constraintTypeIdx]

            if (constraint.hasOwnProperty(constraintType)) {
                let savedConstraintVal = constraint[constraintType]
                delete constraint[constraintType]

                let result = solver.Solve(model)

                if (result.feasible) {
                    let infeasibleConstraint = {
                        'type': constraintType,
                        'name': constraint.name
                    }

                    infeasibleConstraints[constraint.isFood ? 'foods' : 'nutrients'].push(
                        infeasibleConstraint
                    )
                }

                constraint[constraintType] = savedConstraintVal
            }
        }
    }

    return infeasibleConstraints
}

// Use a linear program to find a minimal weight diet that gives all
// the required nutrients
function optimize_diet(foods, nutrients) {
    let solverVars = {}
    let solverConstraints = {}

    // Add variables to the model for foods, and add their
    // min/max value constraints
    for (let foodInd in foods) {
        let food = foods[foodInd]
        let foodVars = {}

        // Add the nutrient amounts to the food variable
        for (let nutrientId in food.nutrients) {
            let nutrient = food.nutrients[nutrientId]

            foodVars['nut'+nutrientId] = parseFloat(nutrient.value)
        }

        // A food variable will have 1 of itself. If this is not set,
        // the min/max for this food in the model constraints will not
        // be used
        foodVars[foodInd] = 1

        // Add the weight of the food so we can minimize the total weight
        foodVars['weight'] = parseFloat(food.serving_amount)

        solverVars[foodInd] = foodVars

        // Set food min/max
        let foodConstraint = {
            'min': parseFloat(food.servings_range[0]),
            'isFood': true,
            'name': food.name
        }

        if (food.has_max_servings) {
            foodConstraint['max'] = parseFloat(food.servings_range[1])
        }

        solverConstraints[foodInd] = foodConstraint
    }

    // Set min/max values of nutrients
    for (let nutrientId in nutrients) {
        let nutrient = nutrients[nutrientId]

        let nutrientConstraint = {}

        if (nutrient.min_value > 0) {
            nutrientConstraint['min'] = parseFloat(nutrient.min_value)
        }

        if (nutrient.has_max_value) {
            nutrientConstraint['max'] = parseFloat(nutrient.max_value)
        }

        // Only add the constraint if we set the min or max values
        if (Object.keys(nutrientConstraint).length) {
            nutrientConstraint['name'] = nutrient.name
            nutrientConstraint['isFood'] = false
            solverConstraints['nut'+nutrientId] = nutrientConstraint
        }
    }

    let model = {
        'optimize': 'weight',
        'opType': 'min',
        'constraints': solverConstraints,
        'variables': solverVars,
    }

    let result = solver.Solve(model)

    // If the result is infeasible, attempt to find which constraints
    // could be removed to result in a feasible solution
    if (!result.feasible) {
        result['infeasibleConstraints'] = find_infeasible_constraints(solver, model)
    }

    return result
}