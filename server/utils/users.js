class Users {
    constructor() {
        this.users = []
    }

    addUser(id, name, room) {
        const user = {id, name, room}
        this.users.push(user)
        return user
    }

    removeUser(id) {
        const person = this.getUser(id)

        if(person) {
            this.users = this.users.filter(user => user.id !== id)
        }

        return person
    }

    getUser(id) {
        return this.users.filter(user => user.id === id)[0]
    }

    getUserList(room) {
        const users = this.users.filter(user => user.room === room)
        const namesArr = users.map(user => user.name)

        return namesArr
    }
}


module.exports = { Users }
