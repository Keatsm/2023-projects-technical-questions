import express from 'express';
import morgan from 'morgan';

// location is the simple (x, y) coordinates of an entity within the system
// spaceCowboy models a cowboy in our super amazing system
// spaceAnimal models a single animal in our amazing system
type location = { x: number, y: number };
type spaceCowboy = { name: string, lassoLength: number };
type spaceAnimal = { type: "pig" | "cow" | "flying_burger" };

// spaceEntity models an entity in the super amazing (ROUND UPPER 100) system
type spaceEntity =
    | { type: "space_cowboy", metadata: spaceCowboy, location: location }
    | { type: "space_animal", metadata: spaceAnimal, location: location };


// === ADD YOUR CODE BELOW :D ===

type spaceAnimalCondensed = { type: "pig" | "cow" | "flying_burger", location: location };
type spaceEntityCowboy = { type: "space_cowboy", metadata: spaceCowboy, location: location };

// Would have put these functions in another file but wasn't sure
// if you wanted all of it in this file

const addEntity = (newEntities: spaceEntity[], spaceDatabase: spaceEntity[]) => {
    for (const entity of newEntities) {
        if (entity.type !== "space_cowboy" &&
            entity.type !== "space_animal") continue;
        spaceDatabase.push(entity);
    }
}

const getAnimals = (cowboyName: string, spaceDatabase: spaceEntity[]) => {
    const animalsWithinDistance = [] as spaceAnimalCondensed[];
    const cowboy = spaceDatabase.find(entity => {
        if (entity.type === 'space_cowboy') {
            if (entity.metadata.name === cowboyName) return true;
        }
    });
    if (cowboy === undefined || cowboy.type === 'space_animal') return animalsWithinDistance;
    for (const entity of spaceDatabase) {
        if (entity.type !== 'space_animal') continue;
        if (withinDistance(entity, cowboy)) {
            animalsWithinDistance.push({
                type: entity.metadata.type,
                location: entity.location
            })
        }
    }
    return animalsWithinDistance;
}

const withinDistance = (spaceAnimal: spaceEntity, cowboy: spaceEntityCowboy) => {
    if (Math.abs(pythagorean(spaceAnimal.location.x, spaceAnimal.location.y)  -
                 pythagorean(cowboy.location.x, cowboy.location.y))
    <= cowboy.metadata.lassoLength) return true;
    return false;
}

const pythagorean = (sideA: number, sideB: number) => {
    return Math.sqrt(Math.pow(sideA, 2) + Math.pow(sideB, 2));
  }

// === ExpressJS setup + Server setup ===
const spaceDatabase = [] as spaceEntity[];
const app = express();
// parse body
app.use(express.json());

// the POST /entity endpoint adds an entity to your global space database
app.post('/entity', (req, res) => {
    addEntity(req.body.entities as spaceEntity[], spaceDatabase);
    res.json();
});

// lasooable returns all the space animals a space cowboy can lasso given their name
app.get('/lassoable', (req, res) => {
    res.json({space_animals: getAnimals(req.query.cowboy_name as string, spaceDatabase) as spaceAnimalCondensed[]})
})

// for logging errors
app.use(morgan('dev'));

app.listen(8080);
