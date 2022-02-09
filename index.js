const fs = require('fs')

const express = require('express')
// const { json } = require('express/lib/response')
// const { fail } = require('assert')
const app = express()
const port = 3000


app.use(express.json())  // middleware stand between the request and  the respons

const tours =JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`))

// log


// app.get('/', (req, res) => {
//      console.log('sam');
//      res.status(200).json({
//         status: "success",
//         data: {
//             tour:tour
//         }
//      })
// })

app.get('/api/v1/tours', (req, res) => {

    res.status(200).json({
        status: "success",
        result: tours.length,
        data: {
            tours:tours
        }
     })
     
})

app.get('/api/v1/tours/:id', (req, res) => {
    console.log(req.params);
    const id = req.params.id * 1
    console.log(id);
    const tour = tours.find(el => el.id === id)

    // if (id > tours.length){
    if (!tour){

        return res.status(404).json({
            status:'fail',
            message: 'invalid id'
        });
    }
    // const tour = tours.find(el => el.id === id)
    console.log(tour);
    res.status(200).json({
        status: "success",
        data: {
            tour
        }
     })
     
})

app.post('/api/v1/tours', (req, res) => {
    // for post to work we need to inclusde a middlware
    console.log(req.body);
    const newId = tours[tours.length -1 ].id + 1;
    console.log(newId);
    const newTour = Object.assign({ id: newId },  req.body)

    console.log(newTour);
    tours.push(newTour)

    fs.writeFile(
        `${__dirname}/dev-data/data/tours-simple.json`,  
        JSON.stringify(tours),
        err =>{
            res.status(201).json({
                status:'success',
                data:{
                    tours: newTour
                }
            })
        }
    )

    // res.send('done')
     
})


app.patch('/api/v1/tours/:id', (req, res) => {
    console.log('sam');
    if( req.params.id *1 > tours.length){
        return res.status(404).json({
            status: 'fail',
            message: 'invalid ID'
        })
    }
    res.status(200).json({
        status:'success',
        data:{
            tour: '<update tour here >'
        }
    })

})



app.delete('/api/v1/tours/:id', (req, res) => {
    console.log('sam');
    if( req.params.id *1 > tours.length){
        return res.status(404).json({
            status: 'fail',
            message: 'invalid ID'
        })
    }
    res.status(204).json({
        status:'success',
        data:{
            tour: '<Deleted tour here >'
        }
    })

})





app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})  