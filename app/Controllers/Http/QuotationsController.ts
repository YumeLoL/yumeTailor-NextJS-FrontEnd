import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Job from "App/Models/Job";
import Quotation from "App/Models/Quotation";
import QuoteValidator from "App/Validators/QuoteValidator";

export default class QuotationsController {
  /**
   * list all quotations, filter by quotation status
   * @param param0
   * @returns
   */
  public async index({ request, response }: HttpContextContract) {
    const { page, limit, status } = request.qs();

    const quoteQuery = Quotation.query()
      .select("quotations.*")
      .orderBy("created_at", "desc");

    // Filter by status
    if (status) {
      quoteQuery.where("status", status);
    }

    // Paginate the results
    const quotes = await quoteQuery.paginate(page || 1, limit || 10);
    return response.json({ quotes });
  }

  /**
   * create a new quotation under a job id by user
   * @param param0
   * @returns
   */
  public async store({ params, request, response }: HttpContextContract) {
    const quote = request.all();
    quote.jobId = params.jobId;
    quote.userId = request.input("user_id");

    await request.validate(QuoteValidator);
    const validatedData = await Quotation.create(quote);

    const job = await Job.findOrFail(params.jobId);
    job.quotationCount++;
    await job.save();

    return response.status(201).json({ validatedData });
  }

  /**
   * show a quotation by quotation id
   * @param param0
   * @returns
   */
  public async show({ params, response }: HttpContextContract) {
    try {
      const quotation = await Quotation.findOrFail(params.quotationId);
      return response.json({ quotation });
    } catch (error) {
      return response.status(404).json({ message: "Quotation not found" });
    }
  }


  /**
   * show all quotations by a user id or job id
   * @param param0
   * @returns
   */
  public async showAll({ params, response }: HttpContextContract) {
    let prefix = params.id.substring(0, 4);
    let flag: number

    if (prefix === "JOB_") {
      flag = 1;
    } else if (prefix === "USER") {
      flag = 0;
    } else {
        return response.status(400).json({ message: "Invalid ID" });
    }

    try {
      const quotations = await Quotation.query()
        .where((flag ? "job_id" : "user_id"), params.id)
        .orderBy("created_at", "desc");

      if (quotations.length === 0) {
        return response.json({
          quotations,
          message: "No quotations found",
        });
      }

      return response.json({ quotations });
    } catch (error) {
      return response.status(500).json({ message: "Server error" });
    }
  }


  /**
   * update a status (pending, accepted or rejected)
   * @param param0
   * @returns
   */
  public async update({ params, request, response }: HttpContextContract) {
    const quote = await Quotation.findOrFail(params.quotationId);
    const job = await Job.findByOrFail("user_id", params.userId);

    if(!quote){
        return response.status(404).json({ message: "Quotation not found" });
    }

    if(!job){
        return response.status(404).json({ message: "Job not found" });
    }

    if(job.userId !== params.userId){
        return response.status(400).json({ message: "Invalid user id" });
    }

    quote.status = request.input("status");
    await quote.save();

    return response.json({ quote, message: "Quotation status updated successfully" });
  }
 
}