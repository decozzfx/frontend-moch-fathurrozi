export default function roles(role: string) {
  switch (role) {
    case "1":
      return "Admin";
    case "2":
      return "Verifikator";
    case "3":
      return "User";
    default:
      return "None";
  }
}
