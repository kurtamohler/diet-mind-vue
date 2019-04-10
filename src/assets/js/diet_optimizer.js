export {optimize_diet}

const solver = require('javascript-lp-solver')

function optimize_diet(foods, nutrients) {
    var solver_vars = {}
    var solver_ints = {}
    var solver_constraints = {}

    for (var foodInd in foods) {
        var food = foods[foodInd]
        var food_vars = {}

        for (var nutrient_id in food.nutrients) {
            var nutrient = food.nutrients[nutrient_id]

            food_vars['nut'+nutrient_id] = nutrient.value
        }

        food_vars[foodInd] = 1
        food_vars['weight'] = food.serving_amount
        solver_vars[foodInd] = food_vars

        solver_ints[foodInd] = 1

        var food_constraint = {}

        food_constraint['min'] = food.servings_range[0]

        if (food.has_max_value) {
            food_constraint['max'] = food.servings_range[1]
        }

        solver_constraints[foodInd] = food_constraint
    }

    for (var nutrient_id in nutrients) {
        var nutrient = nutrients[nutrient_id]

        var nutrient_constraint = {}

        nutrient_constraint['min'] = nutrient.min_value

        if (nutrient.has_max_value) {
            nutrient_constraint['max'] = nutrient.max_value
        }

        solver_constraints['nut'+nutrient_id] = nutrient_constraint
    }


    var model = {
        'optimize': 'weight',
        'opType': 'min',
        'constraints': solver_constraints,
        'variables': solver_vars,
    }

    console.log(solver.Solve(model))
}