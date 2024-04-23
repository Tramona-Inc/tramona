import IdentityModal from "@/components/_utils/IdentityModal";
import { api } from "@/utils/api";


function VerificationCheck() {
    const {data: users} = api.users.myVerificationStatus.useQuery()

  return (
    <div>
      
    </div>
  )
}

export default VerificationCheck
