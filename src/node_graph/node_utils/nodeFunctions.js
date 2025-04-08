export function createNode(x, y, nodes, setNodes) {
    const newNodeId = Object.keys(nodes).length;
    // console.log(nodes)
    const newNode = {
        id: newNodeId,
        x: x,
        y: y,
        radius: 10,
        fill: '#fff',
        connections: []
    };
    setNodes({
        ...nodes,
        [ newNodeId ]: newNode
    });
};

export function deleteNode(nodeId, connections, setConnections, nodes, setNodes) {
    var allConn = nodes[nodeId].connections
    var updatedConnections = {...connections}
    var updatedNodes = {...nodes}

    allConn.forEach(node => {
        var connectionWithDelete = updatedNodes[node.id].connections.filter(nodeName => nodeName != nodeId)
        updatedNodes[node.id].connections = connectionWithDelete;

        delete updatedConnections[`${node.id}-${nodeId}`];
        delete updatedConnections[`${nodeId}-${node.id}`];

    });

    delete updatedNodes[nodeId]

    setNodes(updatedNodes)
    setConnections(updatedConnections)
}

export function handleNodeDrag(e, nodeId, nodes, setNodes) {
    // const updatedNodesOld = nodes.map(node => {
    //     if (node.id === nodeId) {
    //         return {
    //             ...node,
    //             x: e.target.x(),
    //             y: e.target.y()
    //         };
    //     }
    //     return node;
    // });

    const updatedNodes = {
        ...nodes,
        [nodeId]: {
            ...nodes[nodeId],
            x: e.target.x(),
            y: e.target.y(),
        }
    }

    setNodes(updatedNodes);
};

export function nodeSelectionTween(node, radius, mode) {
    //onMouseOver
    if(mode){
        node.to({
            duration: 0,
            radius: radius + 3
        })
    }
    //onMouseLeave
    else{
        node.to({
            duration: 0,
            radius: radius
        })
    }
}

// export function renderNodes(nodes, setNodes) {
//     return nodes.map(node => (
//         <Group
//             x={node.x}
//             y={node.y}
//             draggable
//             onDragMove={() => handleNodeDrag(e, node.id, nodes, setNodes)}
//         >
//             <Circle
//                 key={node.id}
//                 radius={node.radius}
//                 fill={node.fill}
//                 onMouseOver={}
//             // perfectDrawEnabled={false}
//             />
//             <Text
//                 text={node.id.toString()}
//                 fontSize={10}
//                 fill="bg-gray-600"
//                 fontVariant='bold'
//                 x={-3 * node.id.toString().length}
//                 y={-5}
//                 listening={false}
//             />
//         </Group>
//     ));
// };


//Original 

// function createNode(x, y) {
//   const newNodeId = nodes.length + 1;
//   const newNode = {
//     id: newNodeId,
//     x: x,
//     y: y,
//     radius: 10,
//     fill: '#fff'
//   };

//   setNodes([...nodes, newNode]);
// };

// function handleNodeDrag(e, nodeId) {
//   const updatedNodes = nodes.map(node => {
//     if (node.id === nodeId) {
//       return {
//         ...node,
//         x: e.target.x(),
//         y: e.target.y()
//       };
//     }
//     return node;
//   });

//   setNodes(updatedNodes);
// };

// function renderNodes() {
//   return nodes.map(node => (
//     <Group
//       x={node.x}
//       y={node.y}
//       draggable
//       onDragMove={() => handleNodeDrag(e, node.id)}
//     >
//       <Circle
//         key={node.id}
//         radius={node.radius}
//         fill={node.fill}
//         // perfectDrawEnabled={false}
//       />
//       <Text
//         text={node.id.toString()}
//         fontSize={10}
//         fill="bg-gray-600"
//         fontVariant='bold'
//         x={-3 * node.id.toString().length}
//         y={-5}
//         listening={false}
//       />
//       </Group>
//   ));
// };