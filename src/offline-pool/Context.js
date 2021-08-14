class Context {
  factory

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

  setFactory(inputFactory) {
    this.factory = inputFactory
  }

  getFactory() {
    return this.factory
  }
}

export default Context
