import {z} from "zod";
import { type Review } from "@/server/db/schema";
import { promises as fs } from 'fs';

const reviewSchema = z.object({
    data: z.object({
        comments: z.array(
            z.object({
                id: z.number(),
                unit_id: z.number(), // property id on this website
                creation_date: z.string(),
                first_name: z.string(),
                last_name: z.string(),
                title: z.string(),
                comments: z.string(),
                points: z.number(),
            })
        )
    })
})
type IntegrityArizonaReviewInput = z.infer<typeof reviewSchema>;

const mapToReview = (validatedData: IntegrityArizonaReviewInput): Review[] => {
    return validatedData.data.comments.map((comment) => ({
            name: `${comment.first_name} ${comment.last_name}`,
            profilePic: '',
            review: comment.comments,
            rating: comment.points,
    }));
}

const unitId = 762227;
const res = await fetch(`https://integrityarizonavacationrentals.com/wp-admin/admin-ajax.php?action=streamlinecore-api-request&params=%7B%22methodName%22:%22GetAllFeedback%22,%22params%22:%7B%22unit_id%22:${unitId},%22order_by%22:%22newest_first%22,%22show_booking_dates%22:1,%22madetype_id%22:2%7D%7D`)
    .then((res) => res.json()) // parse response as JSON
    .then((data) => reviewSchema.parse(data)) // for fetching from the endpoint
    .then((validatedData) => mapToReview(validatedData))
    .then((reviews) => console.log(reviews))

