import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { Eventlet } from "../index.js";

type EmptyListenerType = () => void;
type TestListenerType = (arg1: number, arg2: string) => void;

class TestClass {
    public readonly classMethod = jest.fn();
    public readonly regularFunctionBound: () => void;
    public readonly regularFunctionBoundEmitCheck: () => void;
    public constructor() {
        this.regularFunctionBound = this.regularFunction.bind(this);
        this.regularFunctionBoundEmitCheck = this.regularFunctionEmitCheck.bind(this);
    }
    public regularFunction() {
        this.classMethod();
    }
    public regularFunctionEmitCheck() {
        expect(Object.hasOwn(this, "emit")).toBe(false);
    }
    public readonly arrowFunction = () => {
        this.classMethod();
    };
    public readonly arrowFunctionEmitCheck = () => {
        expect(Object.hasOwn(this, "emit")).toBe(false);
    };
}

describe("Eventer", function() {
    test("Can be constructed", function() {
        const eventer = new Eventlet();
        expect(eventer).not.toBeUndefined();
    });

    describe("Empty listener", function() {
        let eventer: Eventlet;
        let mockListener1: jest.Mock<EmptyListenerType>;
        let mockListener2: jest.Mock<EmptyListenerType>;
        beforeEach(function() {
            eventer = new Eventlet();
            mockListener1 = jest.fn();
            mockListener2 = jest.fn();
        });

        test("Can add a listener and emit to it", function() {
            eventer.add(mockListener1);
            eventer.emit();
            expect(mockListener1).lastCalledWith();
            expect(mockListener1).toBeCalledTimes(1);
            eventer.emit();
            expect(mockListener1).lastCalledWith();
            expect(mockListener1).toBeCalledTimes(2);
        });

        test("Can add multiple listeners and emit to all of them", function() {
            eventer.add(mockListener1);
            eventer.add(mockListener2);
            eventer.emit();
            expect(mockListener1).lastCalledWith();
            expect(mockListener1).toBeCalledTimes(1);
            expect(mockListener2).lastCalledWith();
            expect(mockListener2).toBeCalledTimes(1);
            eventer.emit();
            expect(mockListener1).lastCalledWith();
            expect(mockListener1).toBeCalledTimes(2);
            expect(mockListener2).lastCalledWith();
            expect(mockListener2).toBeCalledTimes(2);
        });

        test("Can remove a listener and it is no longer called", function() {
            eventer.add(mockListener1);
            eventer.emit();
            expect(mockListener1).lastCalledWith();
            expect(mockListener1).toBeCalledTimes(1);
            eventer.remove(mockListener1);
            eventer.emit();
            expect(mockListener1).lastCalledWith();
            expect(mockListener1).toBeCalledTimes(1);
        });

        test("Does nothing when removing an unregistered listener", function() {
            eventer.add(mockListener1);
            eventer.emit();
            expect(mockListener1).lastCalledWith();
            expect(mockListener1).toBeCalledTimes(1);
            eventer.remove(mockListener2);
            eventer.emit();
            expect(mockListener1).lastCalledWith();
            expect(mockListener1).toBeCalledTimes(2);
        });

        test("Does not double-register a listener", function() {
            eventer.add(mockListener1);
            eventer.emit();
            expect(mockListener1).lastCalledWith();
            expect(mockListener1).toBeCalledTimes(1);
            eventer.add(mockListener1);
            eventer.emit();
            expect(mockListener1).lastCalledWith();
            expect(mockListener1).toBeCalledTimes(2);
            eventer.remove(mockListener1);
            eventer.emit();
            expect(mockListener1).lastCalledWith();
            expect(mockListener1).toBeCalledTimes(2);
        });

        test("Maintains correct call order", function() {
            const expectedCallOrder = [1, 2, 3, 1, 3, 1, 3, 2];
            const orderedListener1: jest.Mock<EmptyListenerType> = jest.fn(() => {
                expect(expectedCallOrder.shift()).toBe(1);
            });
            const orderedListener2: jest.Mock<EmptyListenerType> = jest.fn(() => {
                expect(expectedCallOrder.shift()).toBe(2);
            });
            const orderedListener3: jest.Mock<EmptyListenerType> = jest.fn(() => {
                expect(expectedCallOrder.shift()).toBe(3);
            });

            // Listeners should fire in the order they were added
            eventer.add(orderedListener1);
            eventer.add(orderedListener2);
            eventer.add(orderedListener3);
            eventer.emit();
            expect(orderedListener1).toBeCalledTimes(1);
            expect(orderedListener2).toBeCalledTimes(1);
            expect(orderedListener3).toBeCalledTimes(1);

            eventer.remove(orderedListener2);
            // Re-adding an already-registered listener should not change the order
            eventer.add(orderedListener1);
            eventer.emit();
            expect(orderedListener1).toBeCalledTimes(2);
            expect(orderedListener2).toBeCalledTimes(1);
            expect(orderedListener3).toBeCalledTimes(2);

            eventer.add(orderedListener2);
            eventer.emit();
            expect(orderedListener1).toBeCalledTimes(3);
            expect(orderedListener2).toBeCalledTimes(2);
            expect(orderedListener3).toBeCalledTimes(3);

            expect(expectedCallOrder.length).toBe(0);
        });
    });

    describe("Non-empty listener", function() {
        let eventer: Eventlet<Parameters<TestListenerType>>;
        let mockListener1: jest.Mock<TestListenerType>;
        let mockListener2: jest.Mock<TestListenerType>;
        beforeEach(function() {
            eventer = new Eventlet();
            mockListener1 = jest.fn();
            mockListener2 = jest.fn();
        });

        test("Can add a listener and emit to it", function() {
            eventer.add(mockListener1);
            eventer.emit(1, "hi");
            expect(mockListener1).lastCalledWith(1, "hi");
            expect(mockListener1).toBeCalledTimes(1);
            eventer.emit(2, "bye");
            expect(mockListener1).lastCalledWith(2, "bye");
            expect(mockListener1).toBeCalledTimes(2);
        });

        test("Can add multiple listeners and emit to all of them", function() {
            eventer.add(mockListener1);
            eventer.add(mockListener2);
            eventer.emit(1, "hi");
            expect(mockListener1).lastCalledWith(1, "hi");
            expect(mockListener1).toBeCalledTimes(1);
            expect(mockListener2).lastCalledWith(1, "hi");
            expect(mockListener2).toBeCalledTimes(1);
            eventer.emit(2, "bye");
            expect(mockListener1).lastCalledWith(2, "bye");
            expect(mockListener1).toBeCalledTimes(2);
            expect(mockListener2).lastCalledWith(2, "bye");
            expect(mockListener2).toBeCalledTimes(2);
        });
    });

    describe("Method binding", function() {
        let eventer: Eventlet;
        let classObject: TestClass;
        beforeEach(function() {
            eventer = new Eventlet();
            classObject = new TestClass();
        });

        test("Regular function (unbound) has no this", function() {
            // eslint-disable-next-line @typescript-eslint/unbound-method
            eventer.add(classObject.regularFunction);
            expect(() => { eventer.emit(); }).toThrow("Cannot read properties of undefined");
        });

        test("Regular function (unbound) has no this - emit check", function() {
            // eslint-disable-next-line @typescript-eslint/unbound-method
            eventer.add(classObject.regularFunctionEmitCheck);
            expect(() => { eventer.emit(); }).toThrow("Cannot convert undefined or null to object");
        });

        test("Arrow function uses correct this", function() {
            eventer.add(classObject.arrowFunction);
            eventer.emit();
            expect(classObject.classMethod).toBeCalledTimes(1);
        });

        test("Arrow function uses correct this - emit check", function() {
            eventer.add(classObject.arrowFunctionEmitCheck);
            eventer.emit();
        });

        test("Regular function bound uses correct this", function() {
            eventer.add(classObject.regularFunctionBound);
            eventer.emit();
            expect(classObject.classMethod).toBeCalledTimes(1);
        });

        test("Regular function bound uses correct this - emit check", function() {
            eventer.add(classObject.regularFunctionBoundEmitCheck);
            eventer.emit();
        });
    });
});