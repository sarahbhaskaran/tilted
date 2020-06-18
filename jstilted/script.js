class main {
    constructor() {
        
    }
    run() {
        console.log("progress")
        return 
     }
}




const chooseFileButton = document.querySelector('[data-choose]')
const startButton = document.querySelector('[data-start]')
const recalibrateButton = document.querySelector('[data-recalibrate]')
const forwardButton = document.querySelector('[data-forward]')
const backButton = document.querySelector('[data-back]')
const pdf = document.querySelector('[data-pdf]')

const session = new main()


chooseFileButton.addEventListener('click', button => {
    console.log("choose file")
    //initialize pdf
    pdf = "hello"//= new pdfdisplay()
    //call method in choose File file
})

startButton.addEventListener('click', button => {
    console.log("start")
    session.run()
    //call start loop
    //probably calls the loop in this file
})

recalibrateButton.addEventListener('click', button => {
    //call method in recalibrate
    //call loop again
    console.log("recalibrate")
    session.run()
})

forwardButton.addEventListener('click', button => {
    pdf.forward()
})

backButton.addEventListener('click', button=> {
    pdf.back()
})
