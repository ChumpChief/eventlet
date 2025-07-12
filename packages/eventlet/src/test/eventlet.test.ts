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

describe("Eventlet", function() {
    test("Can be constructed", function() {
        const eventlet = new Eventlet();
        expect(eventlet).not.toBeUndefined();
    });

    describe("Empty listener", function() {
        let eventlet: Eventlet;
        let mockListener1: jest.Mock<EmptyListenerType>;
        let mockListener2: jest.Mock<EmptyListenerType>;
        beforeEach(function() {
            eventlet = new Eventlet();
            mockListener1 = jest.fn();
            mockListener2 = jest.fn();
        });

        test("Can add a listener and emit to it", function() {
            eventlet.add(mockListener1);
            eventlet.emit();
            expect(mockListener1).toHaveBeenLastCalledWith();
            expect(mockListener1).toHaveBeenCalledTimes(1);
            eventlet.emit();
            expect(mockListener1).toHaveBeenLastCalledWith();
            expect(mockListener1).toHaveBeenCalledTimes(2);
        });

        test("Can add multiple listeners and emit to all of them", function() {
            eventlet.add(mockListener1);
            eventlet.add(mockListener2);
            eventlet.emit();
            expect(mockListener1).toHaveBeenLastCalledWith();
            expect(mockListener1).toHaveBeenCalledTimes(1);
            expect(mockListener2).toHaveBeenLastCalledWith();
            expect(mockListener2).toHaveBeenCalledTimes(1);
            eventlet.emit();
            expect(mockListener1).toHaveBeenLastCalledWith();
            expect(mockListener1).toHaveBeenCalledTimes(2);
            expect(mockListener2).toHaveBeenLastCalledWith();
            expect(mockListener2).toHaveBeenCalledTimes(2);
        });

        test("Can remove a listener and it is no longer called", function() {
            eventlet.add(mockListener1);
            eventlet.emit();
            expect(mockListener1).toHaveBeenLastCalledWith();
            expect(mockListener1).toHaveBeenCalledTimes(1);
            eventlet.remove(mockListener1);
            eventlet.emit();
            expect(mockListener1).toHaveBeenLastCalledWith();
            expect(mockListener1).toHaveBeenCalledTimes(1);
        });

        test("Does nothing when removing an unregistered listener", function() {
            eventlet.add(mockListener1);
            eventlet.emit();
            expect(mockListener1).toHaveBeenLastCalledWith();
            expect(mockListener1).toHaveBeenCalledTimes(1);
            eventlet.remove(mockListener2);
            eventlet.emit();
            expect(mockListener1).toHaveBeenLastCalledWith();
            expect(mockListener1).toHaveBeenCalledTimes(2);
        });

        test("Does not double-register a listener", function() {
            eventlet.add(mockListener1);
            eventlet.emit();
            expect(mockListener1).toHaveBeenLastCalledWith();
            expect(mockListener1).toHaveBeenCalledTimes(1);
            eventlet.add(mockListener1);
            eventlet.emit();
            expect(mockListener1).toHaveBeenLastCalledWith();
            expect(mockListener1).toHaveBeenCalledTimes(2);
            eventlet.remove(mockListener1);
            eventlet.emit();
            expect(mockListener1).toHaveBeenLastCalledWith();
            expect(mockListener1).toHaveBeenCalledTimes(2);
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
            eventlet.add(orderedListener1);
            eventlet.add(orderedListener2);
            eventlet.add(orderedListener3);
            eventlet.emit();
            expect(orderedListener1).toHaveBeenCalledTimes(1);
            expect(orderedListener2).toHaveBeenCalledTimes(1);
            expect(orderedListener3).toHaveBeenCalledTimes(1);

            eventlet.remove(orderedListener2);
            // Re-adding an already-registered listener should not change the order
            eventlet.add(orderedListener1);
            eventlet.emit();
            expect(orderedListener1).toHaveBeenCalledTimes(2);
            expect(orderedListener2).toHaveBeenCalledTimes(1);
            expect(orderedListener3).toHaveBeenCalledTimes(2);

            eventlet.add(orderedListener2);
            eventlet.emit();
            expect(orderedListener1).toHaveBeenCalledTimes(3);
            expect(orderedListener2).toHaveBeenCalledTimes(2);
            expect(orderedListener3).toHaveBeenCalledTimes(3);

            expect(expectedCallOrder.length).toBe(0);
        });
    });

    describe("Non-empty listener", function() {
        let eventlet: Eventlet<TestListenerType>;
        let mockListener1: jest.Mock<TestListenerType>;
        let mockListener2: jest.Mock<TestListenerType>;
        beforeEach(function() {
            eventlet = new Eventlet();
            mockListener1 = jest.fn();
            mockListener2 = jest.fn();
        });

        test("Can add a listener and emit to it", function() {
            eventlet.add(mockListener1);
            eventlet.emit(1, "hi");
            expect(mockListener1).toHaveBeenLastCalledWith(1, "hi");
            expect(mockListener1).toHaveBeenCalledTimes(1);
            eventlet.emit(2, "bye");
            expect(mockListener1).toHaveBeenLastCalledWith(2, "bye");
            expect(mockListener1).toHaveBeenCalledTimes(2);
        });

        test("Can add multiple listeners and emit to all of them", function() {
            eventlet.add(mockListener1);
            eventlet.add(mockListener2);
            eventlet.emit(1, "hi");
            expect(mockListener1).toHaveBeenLastCalledWith(1, "hi");
            expect(mockListener1).toHaveBeenCalledTimes(1);
            expect(mockListener2).toHaveBeenLastCalledWith(1, "hi");
            expect(mockListener2).toHaveBeenCalledTimes(1);
            eventlet.emit(2, "bye");
            expect(mockListener1).toHaveBeenLastCalledWith(2, "bye");
            expect(mockListener1).toHaveBeenCalledTimes(2);
            expect(mockListener2).toHaveBeenLastCalledWith(2, "bye");
            expect(mockListener2).toHaveBeenCalledTimes(2);
        });
    });

    describe("Method binding", function() {
        let eventlet: Eventlet;
        let classObject: TestClass;
        beforeEach(function() {
            eventlet = new Eventlet();
            classObject = new TestClass();
        });

        test("Regular function (unbound) has no this", function() {
            // eslint-disable-next-line @typescript-eslint/unbound-method
            eventlet.add(classObject.regularFunction);
            expect(() => { eventlet.emit(); }).toThrow("Cannot read properties of undefined");
        });

        test("Regular function (unbound) has no this - emit check", function() {
            // eslint-disable-next-line @typescript-eslint/unbound-method
            eventlet.add(classObject.regularFunctionEmitCheck);
            expect(() => { eventlet.emit(); }).toThrow("Cannot convert undefined or null to object");
        });

        test("Arrow function uses correct this", function() {
            eventlet.add(classObject.arrowFunction);
            eventlet.emit();
            expect(classObject.classMethod).toHaveBeenCalledTimes(1);
        });

        test("Arrow function uses correct this - emit check", function() {
            eventlet.add(classObject.arrowFunctionEmitCheck);
            eventlet.emit();
        });

        test("Regular function bound uses correct this", function() {
            eventlet.add(classObject.regularFunctionBound);
            eventlet.emit();
            expect(classObject.classMethod).toHaveBeenCalledTimes(1);
        });

        test("Regular function bound uses correct this - emit check", function() {
            eventlet.add(classObject.regularFunctionBoundEmitCheck);
            eventlet.emit();
        });
    });
});
