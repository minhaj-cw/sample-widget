
import { gql } from "@apollo/client";
export const SERVICE_LIST = gql`
query service_categories(
    $type: String
    $business_id: Int
      ){
    service_categories(
      type: $type
      business_id: $business_id
      ){
          id
          name
          services{
            id
            description
            is_group
            is_course
            special_deposit
            service_schedules{
              date_time
            }
            service_group{
              service_id
              is_group
              is_course
              group_type
              client_per_class
              session_per_course
              start_date
              enroll_date
              occurrences
              frequency
              schedule_type
              schedules{
                day
                date
                time
                sameOthers
              }
            }
            service_pricings{
              id
              service_id
              service_name
              duration
              price
              special_price
            }
        }
      }
}
`;