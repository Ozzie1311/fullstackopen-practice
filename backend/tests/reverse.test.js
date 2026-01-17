const { test, describe } = require('node:test')
const assert = require('node:assert')

const { average } = require('../utils/for_tests')

describe('average', () => {
    test('average of one is the number itself', () => {
        assert.strictEqual(average([1]), 1)
    })

    test('average of many', () => {
        assert.strictEqual(average([1, 2, 3, 4, 5, 6]), 3.5)
    })

    test('average of empty array is zero', () => {
        assert.strictEqual(average([]), 0)
    })
})
