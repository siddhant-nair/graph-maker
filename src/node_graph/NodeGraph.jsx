import { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Circle, Group, Text, Line } from 'react-konva';
import { createNode, handleNodeDrag, nodeSelectionTween } from './node_utils/nodeFunctions';
import { handleAddConnection } from './connection_utils/connectionFunctions';

function NodeGraph() {
  const [nodes, setNodes] = useState({});
  const [connections, setConnections] = useState({})
  const [selectedNode, setSelectedNode] = useState(null)
  const [connectionMode, setConnectionMode] = useState(false)
  const [deletionMode, setDeletionMode] = useState(false)

  const stageRef = useRef(null);
  const nodeLayer = useRef(null);

  function toggleConnectionMode() {
    setDeletionMode(false)
    setSelectedNode(null)
    setConnectionMode(val => !val)
  }

  function toggleDeletionMode() {
    setConnectionMode(false)
    setDeletionMode(val => !val)
  }

  function toggleModes(e) {

    if (e.key == 'a') {
      setDeletionMode(false)
      setSelectedNode(null)
      setConnectionMode(val => !val)
    }

    if (e.key == 'd') {
      setConnectionMode(false)
      setSelectedNode(null)
      setDeletionMode(val => !val)      
    }

  }

  useEffect(() => {
    window.addEventListener('keydown', toggleModes)

    return () => {
      window.removeEventListener('keydown', toggleModes)
    };
  }, [])

  function handleStageClick(e) {
    // console.log(e.target, e.currentTarget)
    if (e.target !== e.currentTarget) {
      return;
    }

    if (!connectionMode && !deletionMode) {
      const stage = stageRef.current;
      const pointerPosition = stage.getPointerPosition();
      createNode(pointerPosition.x, pointerPosition.y, nodes, setNodes);
    } else {
      setConnectionMode(false)
      setSelectedNode(null)
      setDeletionMode(false)
    }
  };

  function handleNodeClick(nodeId) {
    if(!connectionMode){
      return
    }

    if (selectedNode === null) {
      setSelectedNode(nodeId)
    } else {
      if(selectedNode != nodeId){
        handleAddConnection(
          selectedNode, 
          nodeId, 
          connections, 
          setConnections, 
          nodes,
          setNodes
        )
        setSelectedNode(nodeId)
      }
    }
  }

  function renderNodes() {

    // Object.entries(nodes).forEach(([id, node]) => { console.log(node) });
    // return nodes.map(node => (
    return Object.entries(nodes).map(([id, node]) => (
      <Group
        key={node.id}
        name={`node${node.id}`}
        x={node.x}
        y={node.y}
        draggable
        onClick={() => { handleNodeClick(node.id)}}
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
          stroke={ 'red'}
          strokeWidth={Number(node.id == selectedNode) && 3}
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

  function renderConnections() {
    // console.log(connections)
    // return connections.map(conn => {
    return Object.entries(connections).map(([id, conn]) => (
      <Line
        key={conn.id}
        points={[nodes[conn.from].x, nodes[conn.from].y, nodes[conn.to].x, nodes[conn.to].y]}
        stroke={conn.stroke}
        strokeWidth={conn.strokeWidth}
      />
    )
    )
  }

  return (
    <>
      <Stage
        ref={stageRef}
        width={window.innerWidth}
        height={window.innerHeight}
        onClick={handleStageClick}
        className='bg-gray-600'
      >
        <Layer>
          {renderConnections()}
        </Layer>

        <Layer ref={nodeLayer}>
          {renderNodes()}
        </Layer>

      </Stage>

      {/* Non Canvas */}
      <div className='absolute m-5 top-0 left-0 gap-10 flex w-fit'>
        <div className='flex flex-col gap-2 text-center items-center'
          onClick={toggleConnectionMode}
        >
          <div className={`size-7 ${connectionMode ? 'bg-green-500' : 'bg-red-600'}  rounded-full`}></div>
          <div className='text-sm text-white'>Connection <br /> {connectionMode ? 'On' : 'Off'}</div>
        </div>
        <div className='flex flex-col gap-2 text-center items-center'
          onClick={toggleDeletionMode}
        >
          <div className={`size-7 ${deletionMode ? 'bg-green-500' : 'bg-red-600'}  rounded-full`}></div>
          <div className='text-sm text-white'>Deletion <br /> {deletionMode ? 'On' : 'Off'}</div>
        </div>
      </div>
    </>
  );
};

export default NodeGraph;