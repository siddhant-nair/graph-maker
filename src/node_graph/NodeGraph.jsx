import { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Circle, Group, Text } from 'react-konva';
import { createNode, handleNodeDrag, nodeSelectionTween } from './node_utils/nodeFunctions';

const NodeGraph = () => {
  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([])
  const [selectedNode, setSelectedNode] = useState(null)
  const [connectionMode, setConnectionMode] = useState(false)

  const stageRef = useRef(null);
  const nodeLayer = useRef(null);

  function handleStageClick(e) {
    console.log(e.target, e.currentTarget)
    if (e.target !== e.currentTarget) {
      return;
    }

    if(!connectionMode){
      const stage = stageRef.current;
      const pointerPosition = stage.getPointerPosition();
      createNode(pointerPosition.x, pointerPosition.y, nodes, setNodes);
    }
  };

  function handleNodeClick(nodeId) {
    if(selectedNode === null){
      setSelectedNode(nodeId)
    }else{
      createConnection(selectedNode, nodeId)
    }
  }

  function renderNodes() {
    return nodes.map(node => (
      <Group
        key={node.id}
        name={`node${node.id}`}
        x={node.x}
        y={node.y}
        draggable
        onClick={() => {}}
        onDragMove={(e) => handleNodeDrag(e, node.id, nodes, setNodes)}
        onMouseOver={() => {
          const hoveredNode = nodeLayer.current.find(`.circle${node.id}`);
          nodeSelectionTween(hoveredNode[0], node.radius, true)
        }}
        onMouseLeave={() => {
          const hoveredNode = nodeLayer.current.find(`.circle${node.id}`);
          nodeSelectionTween(hoveredNode[0], node.radius, false)
        }}
      >
        <Circle 
          name={`circle${node.id}`}
          radius={node.radius}
          fill={node.fill}
          perfectDrawEnabled={false}

        />
        <Text
          text={node.id.toString()}
          fontSize={10}
          fill="bg-gray-600"
          fontVariant='bold'
          x={-3 * node.id.toString().length}
          y={-5}
          listening={false}
        />
      </Group>
    ));
  };


  return (
    <>
      <Stage
        ref={stageRef}
        width={window.innerWidth}
        height={window.innerHeight}
        onClick={handleStageClick}
        className='bg-gray-600'
      >
        <Layer ref={nodeLayer}>
          {renderNodes()}
        </Layer>
      </Stage>
      <div className='absolute m-5 top-0 left-0 flex flex-col gap-2 text-center items-center'
        onClick={() => setConnectionMode(val => !val )}
      >
        <div className={`size-7 ${connectionMode ? 'bg-green-500' : 'bg-red-600'}  rounded-full`}></div>
        <div className='text-sm text-white'>Connection <br /> {connectionMode ? 'On' : 'Off'}</div>
      </div>
    </>
  );
};

export default NodeGraph;