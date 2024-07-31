// // routes/users.tsx
// import { LoaderFunction } from "@remix-run/node";
// import { useLoaderData } from "@remix-run/react";
// import { db } from "../utils/db.server";
// import React from "react";


// export const loader: LoaderFunction = async () => {
//   const users = await db.user.findMany();
//   return { users };
// };

// export default function Users() {
//   const { users } = useLoaderData<any>();

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
//       <h1 className="text-2xl font-bold mb-4">Users List</h1>
//       <table className="min-w-full divide-y divide-gray-200">
//         <thead className="bg-gray-50">
//           <tr>
//             <th
//               scope="col"
//               className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//             >
//               ID
//             </th>
//             <th
//               scope="col"
//               className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//             >
//               Name
//             </th>
//             <th
//               scope="col"
//               className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//             >
//               Email
//             </th>
//           </tr>
//         </thead>
//         <tbody className="bg-white divide-y divide-gray-200">
//           {users.map((user: any) => (
//             <tr key={user.id}>
//               <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                 {user.id}
//               </td>
//               <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                 {user.name}
//               </td>
//               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                 {user.email}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }
