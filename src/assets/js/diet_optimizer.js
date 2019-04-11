export {optimize_diet}

const solver = require('javascript-lp-solver')

function optimize_diet(foods, nutrients) {
    let solver_vars = {}
    let solver_ints = {}
    let solver_constraints = {}

    for (let foodInd in foods) {
        let food = foods[foodInd]
        let food_vars = {}

        for (let nutrient_id in food.nutrients) {
            let nutrient = food.nutrients[nutrient_id]

            food_vars['nut'+nutrient_id] = nutrient.value
        }

        food_vars[foodInd] = 1
        food_vars['weight'] = food.serving_amount
        solver_vars[foodInd] = food_vars

        solver_ints[foodInd] = 1

        let food_constraint = {}

        food_constraint['min'] = food.servings_range[0]

        if (food.has_max_value) {
            food_constraint['max'] = food.servings_range[1]
        }

        solver_constraints[foodInd] = food_constraint
    }

    for (let nutrient_id in nutrients) {
        let nutrient = nutrients[nutrient_id]

        let nutrient_constraint = {}

        nutrient_constraint['min'] = nutrient.min_value

        if (nutrient.has_max_value) {
            nutrient_constraint['max'] = nutrient.max_value
        }

        solver_constraints['nut'+nutrient_id] = nutrient_constraint
    }


    let model = {
        'optimize': 'weight',
        'opType': 'min',
        'constraints': solver_constraints,
        'variables': solver_vars,
    }

    let result = solver.Solve(model)

    return result
}