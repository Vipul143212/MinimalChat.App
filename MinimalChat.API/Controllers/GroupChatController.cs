﻿using Azure;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MinimalChat.Domain.DTOs;
using MinimalChat.Domain.Interfaces;
using MinimalChat.Domain.Models;
using MinmalChat.Data.Helpers;
using MinmalChat.Data.Services;

namespace MinimalChat.API.Controllers
{
    [Route("api")]
    [ApiController]
    public class GroupChatController : ControllerBase
    {
        private readonly IGroupService _groupService;

        public GroupChatController(IGroupService groupService)
        {
            _groupService = groupService;
        }

        #region Create Group

        /// <summary>
        /// Handles HTTP POST requests to create a new group.
        /// </summary>
        /// <param name="currentUser">The unique identifier of the current user.</param>
        /// <param name="groupDto">Data transfer object containing group information.</param>
        /// <returns>
        ///   200 OK if the group is created successfully, along with group details.
        ///   400 Bad Request if the model data is invalid.
        ///   500 Internal Server Error if an error occurs during group creation.
        /// </returns>

        [HttpPost("create-group")]
        public async Task<IActionResult> CreateGroup([FromQuery] Guid currentUser, [FromBody] GroupDto groupDto)
        {
            try
            {
                // Check model validation
                if (!ModelState.IsValid)
                {
                    return BadRequest(new ApiResponse<object>
                    {
                        Message = "Invalid model data",
                        Data = null,
                        StatusCode = 400
                    });
                }

                var addedGroup = await _groupService.CreateGroupAsync(currentUser, groupDto);
                return Ok(new ApiResponse<object>
                {
                    Message = "Group created successfully",
                    Data = new
                    {
                        Id = addedGroup.Id,
                        Name = addedGroup.Name,
                    },
                    StatusCode = 200
                });
            }
            catch (Exception)
            {
                return StatusCode(500, new ApiResponse<object>
                {
                    Message = "An error occurred while creating the group.",
                    Data = null,
                    StatusCode = 500
                });
            }
        }

        #endregion Create Group

        #region Add Members to Group

        /// <summary>
        /// Handles HTTP POST requests to add members to a specified group.
        /// </summary>
        /// <param name="groupId">The unique identifier of the target group.</param>
        /// <param name="currentUserId">The unique identifier of the current user initiating the action.</param>
        /// <param name="memberIds">List of unique identifiers of members to be added to the group.</param>
        /// <returns>
        ///   200 OK if members are added successfully, along with a success message.
        ///   500 Internal Server Error if an error occurs during the operation, with details in the response.
        /// </returns>

        [HttpPost("{groupId}/add-member")]
        public async Task<IActionResult> AddMemberToGroup(Guid groupId, [FromQuery] Guid currentUserId, [FromBody] List<Guid> memberIds)
        {
            try
            {
                var result = await _groupService.AddMemberToGroupAsync(groupId, currentUserId, memberIds);
                 
                return Ok(new ApiResponse<string>
                {
                    Message = result,
                    Data = null,
                    StatusCode = 200,
                });
            }
            catch (Exception ex)
            {
                var response = new ApiResponse<string>
                {
                    Message = "Internal Server Error",
                    Data = ex.Message,
                    StatusCode = 500,
                };

                return StatusCode(500, response);
            }
        }

        #endregion Add Members to Group
    }
}
