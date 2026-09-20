import { PartialType } from "@nestjs/mapped-types";
import UploadFileDto from "./upload-file.dto.js";

class UpdateFileDto extends PartialType(UploadFileDto) {
}

export default UpdateFileDto;