class Context {
  rollBackFunctions = []

  addRollBackOperation = (_rollBackFunction) => {
    this.rollBackFunctions.push(_rollBackFunction)
  }

  rollback = () => {
    for (let index = this.rollBackFunctions.length - 1; index >= 0; index--) {
      const rollBackFunction = this.rollBackFunctions[index]

      rollBackFunction()
    }
    this.rollBackFunctions = []
  }

  commit = () => {
    this.rollBackFunctions = []
  }
}

export default Context
