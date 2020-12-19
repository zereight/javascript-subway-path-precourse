import Dijkstra from '../utils/Dijkstra.js';
import TableContainer from '../view/table.js';
import { errorMessage, cssText, words } from '../keys.js';
import { edges } from '../data.js';
import { getSearhType, radioButtonInit } from './radioButtonController.js';
import {
	getStartPointValue,
	getEndPointValue,
	getValidInput,
	clearStartInput,
	clearEndInput,
} from './stationInputController.js';
import {
	appendChilds,
	clearResultTable,
	makeElement,
} from '../utils/elementUtils.js';

const getEdgeByStations = (start, end) => {
	for (const edge of edges) {
		if (
			(edge.from === start && edge.to === end) ||
			(edge.from === end && edge.to === start)
		) {
			return [edge.time, edge.distance];
		}
	}
};

const getTotalTimeAndDistance = (dijkstraResultPath) => {
	let [totalTime, totalDistance] = [0, 0];
	while (dijkstraResultPath.length > 1) {
		const currStation = dijkstraResultPath.shift();
		const nextStation = dijkstraResultPath[0];
		const [spentTime, spentDistance] = getEdgeByStations(
			currStation,
			nextStation
		);
		totalTime += spentTime;
		totalDistance += spentDistance;
	}
	return [totalTime, totalDistance];
};

const allInputClear = () => {
	radioButtonInit();
	clearStartInput();
	clearEndInput();
};

const isPathExisted = (totalPath) => {
	if (!totalPath || totalPath.length < 2) {
		alert(errorMessage.CANNOT_FIND);
		allInputClear();
		return false;
	}
	return true;
};

const applyDijkstra = (type, start, end) => {
	const key = type === words.SHORTEST_PATH ? 'distance' : 'time';
	const dijkstra = new Dijkstra();
	let totalPath = [];
	edges.forEach((edge) => {
		dijkstra.addEdge(edge.from, edge.to, edge[key]);
	});
	totalPath = dijkstra.findShortestPath(start, end);
	if (!isPathExisted(totalPath)) return [];
	return totalPath;
};

const resultAppender = (
	resultContainer,
	searchType,
	totalPath,
	totalTime,
	totalDistance
) => {
	appendChilds(resultContainer, [
		makeElement({
			tag: 'p',
			innerText: searchType,
            style: `${cssText.fontSizeCSS(1.5)} font-weight: 800; ${cssText.marginCSS('bottom', 20)}`,
        }),
		new TableContainer({ totalTime, totalDistance, totalPath }).initializer(),
	]);
};

export const findPathButtonHandler = () => {
	const resultContainer = document.querySelector('button + div');
	const [start, end] = [getStartPointValue().trim(), getEndPointValue().trim()];
	const searchType = getSearhType();
	let [totalPath, totalTime, totalDistance] = [[], 0, 0];
	clearResultTable();
	if (!getValidInput(start, end)) return;
	totalPath = applyDijkstra(searchType, start, end);
	if (totalPath.length < 2) return;
	[totalTime, totalDistance] = getTotalTimeAndDistance(totalPath.slice());
	resultAppender(resultContainer, searchType, totalPath, totalTime, totalDistance);
};
