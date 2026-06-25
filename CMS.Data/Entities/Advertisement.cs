using System.ComponentModel.DataAnnotations;

namespace CMS.Data.Entities
{
    public class Advertisement
    {
        [Key]
        public int Id { get; set; }

        [StringLength(255)]
        public string? Title { get; set; }

        [Required(ErrorMessage = "Hình ảnh không được để trống")]
        public string ImageUrl { get; set; }

        public string? Link { get; set; }

        public bool IsActive { get; set; } = true;

        public int SortOrder { get; set; } = 0;
    }
}
