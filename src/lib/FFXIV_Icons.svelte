<script context="module">
    import TANK_ICON from "@/assets/ffxiv_job_icons/00_ROLE/TankRole.png"
    import HEALER_ICON from "@/assets/ffxiv_job_icons/00_ROLE/HealerRole.png"
    import DPS_ICON from "@/assets/ffxiv_job_icons/00_ROLE/DPSRole.png"

    import PLD_ICON from "@/assets/ffxiv_job_icons/01_TANK/Job/Paladin.png"
    import WAR_ICON from "@/assets/ffxiv_job_icons/01_TANK/Job/Warrior.png"
    import DRK_ICON from "@/assets/ffxiv_job_icons/01_TANK/Job/DarkKnight.png"
    import GNB_ICON from "@/assets/ffxiv_job_icons/01_TANK/Job/Gunbreaker.png"

    import WHM_ICON from "@/assets/ffxiv_job_icons/02_HEALER/Job/WhiteMage.png"
    import AST_ICON from "@/assets/ffxiv_job_icons/02_HEALER/Job/Astrologian.png"
    import SCH_ICON from "@/assets/ffxiv_job_icons/02_HEALER/Job/Scholar.png"
    import SGE_ICON from "@/assets/ffxiv_job_icons/02_HEALER/Job/Sage.png"

    import SAM_ICON from "@/assets/ffxiv_job_icons/03_DPS/Job/Samurai.png"
    import NIN_ICON from "@/assets/ffxiv_job_icons/03_DPS/Job/Ninja.png"
    import MNK_ICON from "@/assets/ffxiv_job_icons/03_DPS/Job/Monk.png"
    import DRG_ICON from "@/assets/ffxiv_job_icons/03_DPS/Job/Dragoon.png"
    import RPR_ICON from "@/assets/ffxiv_job_icons/03_DPS/Job/Reaper.png"

    import BLM_ICON from "@/assets/ffxiv_job_icons/03_DPS/Job/BlackMage.png"
    import SMN_ICON from "@/assets/ffxiv_job_icons/03_DPS/Job/Summoner.png"
    import RDM_ICON from "@/assets/ffxiv_job_icons/03_DPS/Job/RedMage.png"
    import BLU_ICON from "@/assets/ffxiv_job_icons/06_LIMITED/BlueMage.png"

    import BRD_ICON from "@/assets/ffxiv_job_icons/03_DPS/Job/Bard.png"
    import MCH_ICON from "@/assets/ffxiv_job_icons/03_DPS/Job/Machinist.png"
    import DNC_ICON from "@/assets/ffxiv_job_icons/03_DPS/Job/Dancer.png"


    const ROLE_IMAGE_MAP = {
        "TANK": TANK_ICON,
        "HEALER": HEALER_ICON,
        "DPS": DPS_ICON
    }

    const JOB_IMAGE_MAP = {
        "PLD": PLD_ICON, 
        "WAR": WAR_ICON, 
        "DRK": DRK_ICON, 
        "GNB": GNB_ICON,

        "WHM": WHM_ICON, 
        "AST": AST_ICON, 
        "SCH": SCH_ICON, 
        "SGE": SGE_ICON,

        "SAM": SAM_ICON, 
        "NIN": NIN_ICON, 
        "MNK": MNK_ICON, 
        "DRG": DRG_ICON, 
        "RPR": RPR_ICON,

        "BLM": BLM_ICON, 
        "SMN": SMN_ICON,
        "RDM": RDM_ICON,
        "BLU": BLU_ICON,

        "BRD": BRD_ICON,
        "MCH": MCH_ICON,
        "DNC": DNC_ICON
    }

    export const JOB_LIST = Object.keys(JOB_IMAGE_MAP)
</script>

<script>
    export let ROLE_ICON;
    export let JOB_ICON;
    
    export let size = 64; // for both Height and Width because these icons are square

    let icon;
    if(ROLE_ICON) {
        icon = ROLE_IMAGE_MAP[ROLE_ICON]
    } else if (JOB_ICON) {
        icon = JOB_IMAGE_MAP[JOB_ICON]
    }
</script>

<img src={icon} height={`${size}px`} width={`${size}px`} alt="FFXIV Job Icon"/>
