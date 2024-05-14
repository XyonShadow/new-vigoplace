import axios from "axios"

export default async function getRouteRoles(req, res) {
//   const result = await axios.get("localhost:3000/api/admin/console/routeroles")
  const result = await axios.get("https://api.vigoplace.com/api/admin/console/routeroless")
        .then((res) => console.log(res.data, 'res o'))
        .then((res) => res.data)
        .catch((err) => console.log(err, 'err'))

    // Get data from your database
    // console.log(result.data, 'resultt')
    res.status(200).json(result);
    // res.status(200).json({users: [{name: 'John'}, {name: 'Jane'}]});
  }