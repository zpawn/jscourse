/*
 Создать класс car на прототипах. Добавить и использовать вспомогательный метод getRealDistance(speed) внутри метода
 drive. Взять за основу файл с вебинара104. Характеристики (скорости, расход топлива) машины устанавливаются при
 создании экземпляра класса.
 */
var car = {
    durability: 0.78,
    gas: 100,
    speeds: {
        slow: {
            durability: 0.001,
            gas: 7
        },
        average: {
            durability: 0.001,
            gas: 6.5
        },
        fast: {
            durability: 0.003,
            gas: 6
        }
    },
    drive: function(distance, speed) {
        var speedCharacteristics = this.speeds[speed];
        var drivingDistance = Math.min(distance, this.gas / speedCharacteristics.gas * 100);

        var durabilitySpent = drivingDistance * speedCharacteristics.durability;
        var durabilityLeft = this.durability - durabilitySpent;

        var realDistance;
        if (durabilityLeft < 0) {
            realDistance = this.durability / speedCharacteristics.durability;
        } else {
            realDistance = drivingDistance;
        }

        var realDurabilitySpent = realDistance * speedCharacteristics.durability;
        var realGasSpent = realDistance * speedCharacteristics.gas / 100;
        this.durability -= realDurabilitySpent;
        this.gas -= realGasSpent;
        return car;
    }
};

// car.drive();

var car2 = {
    durability: 0.38,
    gas: 50,
    speeds: {
        slow: {
            durability: 0.002,
            gas: 10
        },
        average: {
            durability: 0.002,
            gas: 12
        },
        fast: {
            durability: 0.006,
            gas: 11
        }
    }
};

car.drive.call(car2, 100, 'slow');

function drive(car, distance, speed) {
    var speedCharacteristics = car.speeds[speed];
    var drivingDistance = Math.min(distance, car.gas / speedCharacteristics.gas * 100);

    var durabilitySpent = drivingDistance * speedCharacteristics.durability;
    var durabilityLeft = car.durability - durabilitySpent;

    var realDistance;
    if (durabilityLeft < 0) {
        realDistance = car.durability / speedCharacteristics.durability;
    } else {
        realDistance = drivingDistance;
    }

    var realDurabilitySpent = realDistance * speedCharacteristics.durability;
    var realGasSpent = realDistance * speedCharacteristics.gas / 100;
    car.durability -= realDurabilitySpent;
    car.gas -= realGasSpent;
    return car;
}

drive(car, 100, 'average');

car.drive(100, 'average');

console.log(car);

/*
 * Prototype way
 */

function Car (car) {

    this.durability = car.durability || 0.78;
    this.gas = car.gas || 100;
    this.speeds = {
        slow: {
            durability: car.speeds.slow.durability || 0.001,
            gas: car.speeds.slow.gas || 7
        },
        average: {
            durability: car.speeds.average.durability || 0.001,
            gas: car.speeds.average.gas || 6.5
        },
        fast: {
            durability: car.speeds.fast.durability || 0.003,
            gas: car.speeds.fast.gas || 6
        }
    };
}

Car.prototype.drive = function (distance, speed) {
    var speedCharacteristics = this.speeds[speed];
    var drivingDistance = Math.min(distance, this.gas / speedCharacteristics.gas * 100);

    var durabilitySpent = drivingDistance * speedCharacteristics.durability;
    var durabilityLeft = this.durability - durabilitySpent;

    var realDistance;
    if (durabilityLeft < 0) {
        realDistance = this.durability / speedCharacteristics.durability;
    } else {
        realDistance = drivingDistance;
    }

    var realDurabilitySpent = realDistance * speedCharacteristics.durability;
    var realGasSpent = realDistance * speedCharacteristics.gas / 100;
    this.durability -= realDurabilitySpent;
    this.gas -= realGasSpent;
    return car;
};

var protoCar1 = new Car({
    durability: 0.38,
    gas: 50,
    speeds: {
        slow: {
            durability: 0.002,
            gas: 10
        },
        average: {
            durability: 0.002,
            gas: 12
        },
        fast: {
            durability: 0.006,
            gas: 11
        }
    }
});
var protoCar2 = new Car({
    durability: 0.38,
    gas: 50,
    speeds: {
        slow: {
            durability: 0.002,
            gas: 10
        },
        average: {
            durability: 0.002,
            gas: 12
        },
        fast: {
            durability: 0.006,
            gas: 11
        }
    }
});

console.log('protoCar:', protoCar1);
console.log('protoCar1:', protoCar1.drive(100, 'slow'));
console.log('protoCar2:', protoCar2.drive(100, 'average'));
console.log('===============================================================================');

/*
 * Prototype way (Maximazer)
 */

function Car (carCharacteristics) {
    this.durability = carCharacteristics.durability || 0.78;
    this.gas = carCharacteristics.gas || 100;
    this.speeds = JSON.parse(JSON.stringify(carCharacteristics.speeds)); // создаем копию объекта, а не ссылаемся по ссылке
}

Car.prototype._getRealDistance = function (distance, speed) {
    var speedCharacteristics = this.speeds[speed];
    var drivingDistance = Math.min(distance, this.gas / speedCharacteristics.gas * 100);

    var durabilitySpent = drivingDistance * speedCharacteristics.durability;
    var durabilityLeft = this.durability - durabilitySpent;

    var realDistance;
    if (durabilityLeft < 0) {
        realDistance = this.durability / speedCharacteristics.durability;
    } else {
        realDistance = drivingDistance;
    }

    return realDistance;
};

Car.prototype.drive = function (distance, speed) {
    var realDistance = this._getRealDistance(distance, speed);
    var speedCharacteristics = this.speeds[speed];
    var durabilitySpent = realDistance * speedCharacteristics.durability;

    var gasSpent = realDistance * speedCharacteristics.gas / 100;
    this.durability -= durabilitySpent;
    this.gas -= gasSpent;
};

var sedanSpeeds = {
    slow: {
        durability: 0.001,
        gas: 7
    },
    average: {
        durability: 0.001,
        gas: 6.5
    },
    fast: {
        durability: 0.003,
        gas: 6
    }
};

var sedan = new Car({
    durability: 100,
    gas: 90,
    speeds: sedanSpeeds
});

console.log(sedan.gas, sedan.durability);
sedan.drive(100, 'slow');
console.log(sedan.gas, sedan.durability);