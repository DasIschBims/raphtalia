module.exports = {
    name: "threadCreate",
    execute(thread) {
        if (thread.joinable) {
            thread.join()
        }
    }
}