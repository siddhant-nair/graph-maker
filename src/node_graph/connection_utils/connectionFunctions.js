export function handleAddConnection(
    fromId,
    toId,
    {
        connections,
        setConnections,
        nodes,
        setNodes
    }
) {
    if (connections.hasOwnProperty(`${fromId}-${toId}`) ||
        connections.hasOwnProperty(`${toId}-${fromId}`)) {

        var newConnections = { ...connections }

        delete newConnections[`${fromId}-${toId}`]
        delete newConnections[`${toId}-${fromId}`]

        setConnections(newConnections)
        
        const connectionsFrom = [...nodes[fromId].connections].filter((val) => val != toId)
        const connectionsTo = [...nodes[toId].connections].filter((val) => val != fromId)
        

        setNodes({
            ...nodes,
            [fromId]: {
                ...nodes[fromId],
                connections: connectionsFrom
            },
            [toId]: {
                ...nodes[toId],
                connections: connectionsTo
            },
        })
        console.log(fromId, [...nodes[fromId].connections], connectionsFrom)
        return
    }

    const newConn = {
        id: `${fromId}-${toId}`,
        from: fromId,
        to: toId,
        stroke: 'black',
        weight: 1,
        strokeWidth: 3,
    }

    const connectionsFrom = [...nodes[fromId].connections, toId]
    const connectionsTo = [...nodes[toId].connections, fromId]

    setNodes({
        ...nodes,
        [fromId]: {
            ...nodes[fromId],
            connections: connectionsFrom
        },
        [toId]: {
            ...nodes[toId],
            connections: connectionsTo
        },
    })

    setConnections({ ...connections, [`${fromId}-${toId}`]: newConn })
    // console.log(connections)
    // console.log(nodes)
}

export function setConnectionWeight(){
    
}

export function updateWeights(
    evt,
    {
        setInputState,
        inputState,
        setConnections,
        connections,
    }
) {
    const sanitized = evt.target.value.replace(/\D/g, '');

    setInputState({
        ...inputState,
        value: sanitized,
    })

    var connId = inputState.connectionId

    setConnections({
        ...connections,
        [connId]: {
            ...connections[connId],
            weight: sanitized || 0,
        }
    })
}

export function handleOnBlur() {
    set
}