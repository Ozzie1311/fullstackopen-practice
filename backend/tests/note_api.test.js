const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const assert = require('node:assert')
const Note = require('../models/note')
const api = supertest(app)
const endpoint = '/api/notes'

beforeEach(async () => {
    await Note.deleteMany({})
    await Note.insertMany(helper.initialNotes)
    // const noteObjects = helper.initialNotes.map((note) => new Note(note))
    // const promiseArray = noteObjects.map((note) => note.save())
    // await Promise.all(promiseArray)
})

//Organizing
describe('when there is initially some notes saved', () => {
    test('notes are returned as json', async () => {
        await api
            .get(endpoint)
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all notes are returned', async () => {
        const notesAtEnd = await helper.notesInDB()

        assert.strictEqual(notesAtEnd.length, helper.initialNotes.length)
    })

    test('a specific note is within the returned notes', async () => {
        const notesAtEnd = await helper.notesInDB()

        const contents = notesAtEnd.map((note) => note.content)

        assert(contents.includes('Browser can only execute JavaScript'))
    })
})

describe('viewing a specific note', () => {
    test('suceed with a valid id', async () => {
        const notesAtStart = await helper.notesInDB()
        const noteToView = notesAtStart[0]

        const resultNote = await api
            .get(`${endpoint}/${noteToView.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        assert.deepStrictEqual(resultNote.body, noteToView)
    })

    test('fails with statuscode 400 id is invalid', async () => {
        const invalidId = '123456aas5'
        await api.get(`${endpoint}/${invalidId}`).expect(400)
    })
})

describe('addition of a new note', () => {
    test('succeeds with a valid data', async () => {
        const newNote = {
            content: 'async/await simplifies making async calls',
            important: true,
        }

        await api
            .post(endpoint)
            .send(newNote)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        const notesAtEnd = await helper.notesInDB()
        assert.strictEqual(notesAtEnd.length, helper.initialNotes.length + 1)

        const contents = notesAtEnd.map((note) => note.content)
        assert(contents.includes(newNote.content))
    })

    test('fails with status code 400 if data is invalid', async () => {
        const newNote = {
            important: true,
        }

        await api.post(endpoint).send(newNote).expect(400)

        const notesAtEnd = await helper.notesInDB()
        //Constatando que realmente la nota no se agregó, es decir, que no aumente la longitud
        assert.strictEqual(notesAtEnd.length, helper.initialNotes.length)
    })
})

describe('deletion of a note', () => {
    test('succeeds with status code 204 if id is valid', async () => {
        const notesAtStart = await helper.notesInDB()
        const noteToEliminate = notesAtStart[0]

        //Esperamos el código 204 que indica no content
        await api.delete(`${endpoint}/${noteToEliminate.id}`).expect(204)

        //verificamos que la nota realmente haya disminuido en 1 la longitud de las notas
        const notesAtEnd = await helper.notesInDB()

        //Verificamos que el contenido no exista en la lista de notas
        const contents = notesAtEnd.map((note) => note.content)
        assert(!contents.includes(noteToEliminate.content))

        assert.strictEqual(notesAtEnd.length, helper.initialNotes.length - 1)
    })
})

// test('there are two notes', async () => {
//     const response = await api.get(endpoint)

//     assert.strictEqual(response.body.length, helper.initialNotes.length)
// })

// test('the first note is about HTTP methods', async () => {
//     const response = await api.get(endpoint)

//     const contentsArray = response.body.map((r) => r.content)

//     // assert.strictEqual(contentsArray.includes('HTML is easy'), true)
//     assert(contentsArray.includes('HTML is easy'))
// })

// test('a valid note can be added', async () => {
//     const newNote = {
//         content: 'async/await simplifies making async calls',
//         important: true,
//     }

//     await api
//         .post(endpoint)
//         .send(newNote)
//         .expect(201)
//         .expect('Content-Type', /application\/json/)

//     const notesAtEnd = await helper.notesInDB()
//     const contents = notesAtEnd.map((r) => r.content)
//     assert.strictEqual(notesAtEnd.length, helper.initialNotes.length + 1)

//     assert(contents.includes('async/await simplifies making async calls'))
// })

// test('note without content is not added', async () => {
//     const newNote = {
//         important: true,
//     }

//     await api.post(endpoint).send(newNote).expect(400)

//     const notesAtEnd = await helper.notesInDB()
//     assert.strictEqual(notesAtEnd.length, helper.initialNotes.length)
// })

// test('a specific note can be viewed', async () => {
//     const notesAtStart = await helper.notesInDB()
//     const noteToView = notesAtStart[0]
//     const resultNote = await api
//         .get(`/api/notes/${noteToView.id}`)
//         .expect(200)
//         .expect('Content-Type', /application\/json/)

//     assert.deepStrictEqual(resultNote.body, noteToView)
// })

// test('a note can be deleted', async () => {
//     const notesAtStart = await helper.notesInDB()
//     const noteToDelete = notesAtStart[0]

//     await api.delete(`${endpoint}/${noteToDelete.id}`).expect(204)

//     const notesAtEnd = await helper.notesInDB()
//     const contents = notesAtEnd.map((note) => note.content)
//     assert(!contents.includes(noteToDelete.content))

//     assert.strictEqual(notesAtEnd.length, helper.initialNotes.length - 1)
// })

after(async () => {
    await mongoose.connection.close()
})
