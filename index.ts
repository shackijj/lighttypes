abstract class Type<T> {
    public type!: T;
    public abstract validate(value: unknown): T;
}

// tslint:disable-next-line: max-classes-per-file
class StringType extends Type<string> {
    public validate(value: unknown): string {
        if (typeof value === "string") {
            return value;
        }
        throw new Error("value is not a string");
    }
}

// tslint:disable-next-line: max-classes-per-file
class NumberType extends Type<number> {
    public validate(value: unknown): number {
        if (typeof value === "number") {
            return value;
        }
        throw new Error("value is not a number");
    }
}

interface IType {
    type: unknown;
}

type StaticType<T extends IType> = T["type"];

interface IObject {
    [key: string]: Type<unknown>;
}

// tslint:disable-next-line: max-classes-per-file
class ObjectType<T extends IObject> extends Type<{[P in keyof T]: StaticType<T[P]>}> {
    constructor(input: T) {
        super();
    }
    public validate(value: unknown): {[P in keyof T]: StaticType<T[P]>} {
        // implement me
        return value as {[P in keyof T]: StaticType<T[P]>};
    }
}

const types = {
    number: new NumberType(),
    object: <T extends IObject>(config: T): ObjectType<T> => {
        return new ObjectType(config);
    },
    string: new StringType(),
};

const MyObject = types.object({
    x: types.number,
    y: types.object({
        foo: types.string,
    }),
});

// will fail
const obj = MyObject.validate({});
// will succeed
const obj2 = MyObject.validate({
    x: 2,
    y: {
        foo: "string",
    },
});
// will fail
const str = types.string.validate(123);
