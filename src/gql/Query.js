
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

export const TIME_SLOT = gql`
query business_time_slot(
    $business_id:        Int!
    $date:               String!
    $service_pricing_id: Int!
){
    business_time_slot(
      business_id:        $business_id
      date:               $date
      service_pricing_id: $service_pricing_id
      ){
        date_slots{
        s_date
      }
      time_slots{
       s_time
    }
  }
}
`;
// group_service_available_occurrences
export const AVAIABLE_OCCURENCES = gql`
    query group_service_available_occurrences(
        $business_id: Int!
        $service_id: Int!
        $date: String!
        $time: String!
    ){
    group_service_available_occurrences(
        business_id: $business_id
        service_id: $service_id
        date: $date
        time: $time
    ){
        available_occurrences
    }
}`;

export const SINGLE_SHOP = gql`
query single_business(
  $slug: String!
){
    single_business(
     slug: $slug
      ){
        business{
          id
          name
          about
          country
          location
          thumbnail
          slider
          latitude
          longitude
          website
          description
          rating
          number_of_ratings
          social_links{
            facebook
            instagram
            linkedin
            tiktok
          }
          upfront_amount
          cancellation{
            value
          }
          video_vetting
          slot_duration
          work_hours{
            id
            duration
            weekday
            s_time
            e_time
          }
        }
        close_weekday{
          weekday
        }
        close_date{
          date
        }
        business_vouchers{
          id
          name
          value
          retail
          title
          description
          note
          valid_for
          limit_number_of_sales
          total_sale
          services_included{
            value
            label
          }
        }
        business_tax
        block_date{
          date
        }
  }
  me{
    first_name
    last_name
  }
}
`;