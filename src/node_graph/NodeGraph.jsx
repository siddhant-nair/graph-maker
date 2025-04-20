import { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Circle, Group, Text, Line, Rect } from 'react-konva';
import { createNode, deleteNode, handleNodeDrag, nodeSelectionTween } from './node_utils/nodeFunctions';
import { handleAddConnection } from './connection_utils/connectionFunctions';

function NodeGraph() {
  const [nodes, setNodes] = useState({});
  const [connections, setConnections] = useState({})
  const [selectedNode, setSelectedNode] = useState(null)
  const [connectionMode, setConnectionMode] = useState(false)
  const [deletionMode, setDeletionMode] = useState(false)

  const [connectionHovered, setConnectionHovered] = useState(false)
  const [inputState, setInputState] = useState({
    x: 0, y: 0, 
    display: "none", 
    value: 0, 
    connectionId: '0-0',
  })

  const stageRef = useRef(null);
  const nodeLayer = useRef(null);
  const inputRef = useRef(null)

  function toggleConnectionMode() {
    setDeletionMode(false)
    setSelectedNode(null)
    setConnectionMode(val => !val)
  }

  function toggleDeletionMode() {
    setConnectionMode(false)
    setSelectedNode(null)
    setDeletionMode(val => !val)
    // console.log(deletionMode)
  }

  function toggleModes(e) {

    if (e.key == 'a') {
      toggleConnectionMode()
    }

    if (e.key == 'd') {
      toggleDeletionMode()
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
      setInputState({x:0, y:0, display: "none", value: 0, connectionId: null})
      setConnectionMode(false)
      setSelectedNode(null)
      setDeletionMode(false)
    }
  };

  function handleNodeClick(nodeId) {
    console.log(deletionMode)
    // if(!connectionMode && !deletionMode){
    //   return
    // }

    if (!deletionMode) {
      if (!connectionMode) {
        toggleConnectionMode()
      }
      if (selectedNode === null) {
        setSelectedNode(nodeId)
      } else {
        if (selectedNode != nodeId) {
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

    if (deletionMode) {
      console.log('deletionMode')
      if (selectedNode == null || selectedNode != nodeId) {
        setSelectedNode(nodeId)
      }
      else {
        deleteNode(nodeId, connections, setConnections, nodes, setNodes)
        setSelectedNode(null)
        console.log(nodes)
        console.log(connections)
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
        onClick={() => { handleNodeClick(node.id) }}
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
          stroke={'red'}
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
    return Object.entries(connections).map(([id, conn]) => {
      let xPosi = (nodes[conn.from].x + nodes[conn.to].x) / 2
      let yPosi = (nodes[conn.from].y + nodes[conn.to].y) / 2 - 15

      let isHovered = connectionHovered == conn.id

      return (
      <Group
        key={conn.id}
        // onClick={() => console.log('clicked text')}
        >
        <Rect
          onMouseOver={() => {
            setConnectionHovered(conn.id)
            // console.log('hover triggered')
          }}
          onMouseLeave={() => {
            setConnectionHovered(null)
            // console.log('hover triggered')
          }}

          onClick={(e) => {
            console.log(e)
            // console.log(e.evt.clientX, e.evt.clientY)
            setInputState({
              x: e.evt.clientX,
              y: e.evt.clientY,
              display: "block",
              value: conn.weight,
              connectionId: conn.id,
            })

            inputRef.current.focus()
          }}
          height={24}
          width={24}
          fill={'#4a556900'}
          // fill={'red'}
          x={xPosi - 9}
          y={yPosi - 6}
        />
        <Line
          key={conn.id}
          points={[nodes[conn.from].x, nodes[conn.from].y, nodes[conn.to].x, nodes[conn.to].y]}
          stroke={conn.stroke}
          strokeWidth={conn.strokeWidth}
          />
        <Text
          text={conn.weight.toString()}
          fontSize={isHovered ? 24 : 12}
          fill="white"
          fontVariant='bold'
          x={xPosi - (isHovered ? 3 : 0)}
          y={yPosi - (isHovered ? 6 : 0)}
          listening={false}
        />
      </Group>
    )
  }
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
      <input type="number" name="weight-input" ref={inputRef}
        className={`absolute origin-center w-[36px] h-[36px] 
          text-white bg-gray-600 font-bold border-2 border-white text-center
          text-[12px]`}
        onChange={(e) => {
          // console.log(e.target.value)
          setInputState({
            ...inputState,
            value: e.target.value,
          })

          var connId = inputState.connectionId

          setConnections({
            ...connections,
            [connId]: {
              ...connections[connId],
              weight: e.target.value,
            }
          })
        }
      }

        autoFocus
        placeholder={inputState.value}
        style={{
          top: inputState.y - 18,
          left: inputState.x - 18,
          display: inputState.display,
        }}
      />
      <div className='absolute m-5 top-0 left-0 gap-10 flex w-fit'>
        <div className='flex flex-col gap-2 text-center items-center'
          onClick={toggleConnectionMode}
        >
          <div className={`size-7 ${connectionMode ? 'bg-green-500' : 'bg-red-600'}  rounded-full`}></div>
          <div className='text-sm text-white'>Connection <br /> {connectionMode ? 'On' : 'Off'} (a)</div>
        </div>
        <div className='flex flex-col gap-2 text-center items-center'
          onClick={toggleDeletionMode}
        >
          <div className={`size-7 ${deletionMode ? 'bg-green-500' : 'bg-red-600'}  rounded-full`}></div>
          <div className='text-sm text-white'>Deletion <br /> {deletionMode ? 'On' : 'Off'} (d)</div>
        </div>
      </div>
    </>
  );
};

export default NodeGraph;