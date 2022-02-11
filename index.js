const fs = require('fs')
const morgan =require('morgan')
const express = require('express')
const app = express()
const port = 3000

// 1) tiny
app.use(morgan('dev'))
app.use(express.json())  // middleware stand between the request and  the respons
// this is a middle ware
app.use((req, res, next) => {
    console.log(' this midiware has show ');
    next()
})


app.use((req, res, next) => {
    // console.log(' this midiware has show ');
    req.requestTime = new Date().toString();
    next()
})

const tours =JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`))


// 2) route handler
const GetAllTours =  (req, res) => {
    console.log(req.requestTime);

    res.status(200).json({
        status: "success",
        result: tours.length,
        data: {
            tours:tours
        }
     })
     
}
const Gettour =  (req, res) => {
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
     
}
const CreateTour =(req, res) => {
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
     
}
const Updatetour =  (req, res) => {
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

}
const RemoveTour =  (req, res) => {
    console.log('sam');
    if( req.params.id *1 > tours.length){
        return res.status(404).json({
            status: 'fail',
            message: 'invalid ID'
        })
    }
    res.status(204).json({
        status:'success',
        data:null
    })

}

// app.get('/api/v1/tours',GetAllTours)
// app.get('/api/v1/tours/:id',Gettour)
// app.post('/api/v1/tours', CreateTour)
// app.patch('/api/v1/tours/:id',Updatetour)
// app.delete('/api/v1/tours/:id',RemoveTour)


// 3 route
app.route('/api/v1/tours').get(GetAllTours).post(CreateTour)
// this is a middleware
app.use((req, res, next) => {
    console.log(' this midiware has second');
    next()
})
// this is a middleware

app.route('/api/v1/tours/:id').get(Gettour).patch(Updatetour).delete(RemoveTour)


//4 restart server.

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})  