import { type FC, useCallback, useEffect, useRef, useState } from "react";
import { Firework, FireworksDirector } from "../model/index.js";

export type FireworksViewProps = {
    readonly fireworksDirector: FireworksDirector;
};

type Explosion = {
    x: number,
    y: number,
    radius: number,
    color: string,
    opacity: number,
}

export const FireworksView: FC<FireworksViewProps> = ({ fireworksDirector }) => {
    const launchedFireworks = useRef(new Set<Firework>());
    const explosions = useRef(new Set<Explosion>());

    const [launchedFireworksDebug, setLaunchedFireworksDebug] = useState(0);
    const [explosionsDebug, setExplosionsDebug] = useState(0);

    useEffect(() => {
        const handleLaunched = (firework: Firework) => {
            const handleExploded = (radius: number, color: string) => {
                firework.exploded.remove(handleExploded);
                explosions.current.add({
                    x: firework.position.x,
                    y: firework.position.y,
                    radius,
                    color,
                    opacity: 1,
                });
                setExplosionsDebug(explosions.current.size);
                launchedFireworks.current.delete(firework);
                setLaunchedFireworksDebug(launchedFireworks.current.size);
            };
            launchedFireworks.current.add(firework);
            setLaunchedFireworksDebug(launchedFireworks.current.size);
            firework.exploded.add(handleExploded);
        };
        fireworksDirector.launched.add(handleLaunched);
        return () => {
            fireworksDirector.launched.remove(handleLaunched);
        };
    }, [fireworksDirector]);

    useEffect(() => {
        let requestId: number;
        const fadeExplosions = () => {
            for (const explosion of explosions.current) {
                explosion.opacity -= 0.01;
                if (explosion.opacity <= 0) {
                    explosions.current.delete(explosion);
                    setExplosionsDebug(explosions.current.size);
                }
            }
            requestId = requestAnimationFrame(fadeExplosions);
        };
        requestId = requestAnimationFrame(fadeExplosions);
        return () => {
            cancelAnimationFrame(requestId);
        };
    });

    const renderScene = useCallback((canvasElem: HTMLCanvasElement | null) => {
        let requestId: number | undefined;
        // TODO: Whenver cleanup function reaches stable support, remove this and return the cleanup function
        if (canvasElem === null) {
            if (requestId !== undefined) {
                cancelAnimationFrame(requestId);
            }
            return;
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const context = canvasElem.getContext("2d")!;
        // Make up positive
        context.translate(0, canvasElem.height);
        context.scale(1, -1);
        const doRender = () => {
            context.fillStyle = "black";
            context.fillRect(0, 0, canvasElem.width, canvasElem.height);
            context.fillStyle = "#888";
            for (const firework of launchedFireworks.current) {
                context.beginPath();
                context.arc(firework.position.x, firework.position.y, 5, 0, 2 * Math.PI);
                context.fill();
            }
            for (const explosion of explosions.current) {
                context.fillStyle = explosion.color;
                context.globalAlpha = explosion.opacity;
                context.beginPath();
                context.arc(explosion.x, explosion.y, explosion.radius, 0, 2 * Math.PI);
                context.fill();
                context.globalAlpha = 1;
            }
            requestId = requestAnimationFrame(doRender);
        };
        requestId = requestAnimationFrame(doRender);
        // return () => {
        //     cancelAnimationFrame(requestId);
        // };
    }, []);

    return (
        <>
            <canvas width={ 500 } height={ 500 } ref={renderScene}></canvas>
            <div>
                Current launched firework count: { launchedFireworksDebug }<br></br>
                Current explosion count: { explosionsDebug }
            </div>
        </>
    );
};
